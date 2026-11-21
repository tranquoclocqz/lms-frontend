"use client";

import { getStoredAccessToken } from "@/lib/auth/session";
import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";
import "@videojs/react/video/skin.css";
import Hls, { LoaderCallbacks, LoaderConfiguration, LoaderContext } from "hls.js";
import { useEffect, useRef } from "react";

// Hàm giải mã ngược Key bằng Web Crypto API (không cần cài thêm thư viện)
async function deobfuscateKey(
    obfuscatedBuffer: ArrayBuffer,
    lessonId: number | string,
    timestamp: string
): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${lessonId}:${timestamp}:${process.env.NEXT_PUBLIC_SALT}`);
    // Tính SHA-256 bằng API gốc của trình duyệt
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const maskBytes = new Uint8Array(hashBuffer).slice(0, 16);
    const obfuscatedBytes = new Uint8Array(obfuscatedBuffer);
    const realKeyBytes = new Uint8Array(16);

    // Thực hiện phép toán XOR ngược lại
    for (let i = 0; i < 16; i++) {
        realKeyBytes[i] = obfuscatedBytes[i] ^ maskBytes[i];
    }

    return realKeyBytes.buffer;
}

// Tạo Custom Key Loader kế thừa từ Loader mặc định của hls.js
class CustomKeyLoader extends Hls.DefaultConfig.loader {
    private lessonId: number | string;

    constructor(config: any, lessonId: number | string) {
        super(config);
        this.lessonId = lessonId;
    }

    load(
        context: LoaderContext,
        config: LoaderConfiguration,
        callbacks: LoaderCallbacks<LoaderContext>
    ) {
        if (context.type === 'key') {
            const originalOnSuccess = callbacks.onSuccess;

            callbacks.onSuccess = async (response, stats, ctx, networkDetails) => {
                const xhr = networkDetails as XMLHttpRequest;
                const timestamp = xhr?.getResponseHeader('X-Key-Time');
                if (timestamp && response.data instanceof ArrayBuffer) {
                    try {
                        // Giải mã lại thành Key thật trước khi đưa cho hls.js
                        response.data = await deobfuscateKey(
                            response.data,
                            this.lessonId,
                            timestamp
                        );
                    } catch (err) {
                        console.error("Lỗi giải mã Key:", err);
                    }
                }

                originalOnSuccess(response, stats, ctx, networkDetails);
            };
        }

        super.load(context, config, callbacks);
    }
}

export function HlsLessonVideo({
    src,
    watermark,
    lessonId, // Truyền thêm lessonId vào props
}: {
    src: string;
    watermark: string;
    lessonId: number | string;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || !src) {
            return;
        }

        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                manifestLoadingMaxRetry: 2,
                levelLoadingMaxRetry: 2,
                fragLoadingMaxRetry: 2,
                // Gắn CustomKeyLoader vào cấu hình
                loader: function (config:any) {
                    return new CustomKeyLoader(config, lessonId);
                }  as unknown as typeof Hls.DefaultConfig.loader,
                xhrSetup: (xhr, url) => {
                    const u = url.toLowerCase();
                    if (u.includes('.key') || u.includes('key') || u.includes('getkey')) {
                        xhr.withCredentials = true
                    }
                        // if you use token-based auth, store token in localStorage under `lms_token`
                        const token = getStoredAccessToken();
                        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
                        // Custom header can help backend route if same origin rules required
                        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
                },
            });

            hlsRef.current = hls;

            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data?.fatal && data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                }

                if (data.details === Hls.ErrorDetails.FRAG_PARSING_ERROR) {
                    console.error("Lỗi giải mã Segment (Sai Key/Key hỏng)!");
                    hls.stopLoad();
                    return;
                }

                if (data?.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            if (data.details === Hls.ErrorDetails.KEY_LOAD_ERROR) {
                                console.error("Lỗi không tải được Key từ API!");
                                hls.stopLoad();
                            } else {
                                hls.startLoad();
                            }
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                void video.play().catch(() => undefined);
            });

            hls.loadSource(src);
            hls.attachMedia(video);

            return () => {
                hls.destroy();
                if (hlsRef.current === hls) {
                    hlsRef.current = null;
                }
            };
        } 
        // ... (Giữ nguyên phần xử lý native HLS cho Safari bên dưới)
    }, [src, lessonId]);

    return (
        <div className="relative h-full w-full overflow-hidden bg-black">
            <VideoPlayer>
                <VideoSkin className="h-full w-full">
                    <Video
                        ref={videoRef}
                        playsInline
                        preload="metadata"
                        className="h-full w-full bg-black"
                    />
                </VideoSkin>
            </VideoPlayer>
        </div>
    );
}
