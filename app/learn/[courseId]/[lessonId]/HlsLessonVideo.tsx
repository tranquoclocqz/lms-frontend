"use client";

import { getStoredAccessToken } from "@/lib/auth/session";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

export function HlsLessonVideo({
    src,
    watermark,
}: {
    src: string;
    watermark: string;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const hlsRef = useRef<Hls | null>(null)

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
                xhrSetup: (xhr, url) => {
                    // intercept key requests to attach credentials / Authorization
                    xhr.responseType = 'arraybuffer'
                    const u = url.toLowerCase()
                    if (u.includes('.key') || u.includes('key') || u.includes('getkey')) {
                        xhr.withCredentials = true
                    }
                        // if you use token-based auth, store token in localStorage under `lms_token`
                        const token = getStoredAccessToken();
                        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
                        // Custom header can help backend route if same origin rules required
                        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
                },
            })

            hlsRef.current = hls

            hls.on(Hls.Events.ERROR, (_event, data) => {
                console.error('HLS error:', data)

                if (data?.fatal && data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError()
                }
                console.error('HLS error:', {
                    type: data?.type,
                    details: data?.details,
                    fatal: data?.fatal,
                });

                // Bắt lỗi không giải mã được do sai/lỗi Key -> Stop ngay lập tức
                if (data.details === Hls.ErrorDetails.FRAG_PARSING_ERROR) {
                    console.error("Lỗi giải mã Segment (Sai Key/Key hỏng)! Dừng load để tránh loop.");
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
            })

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                void video.play().catch(() => undefined)
            })

            // load source and attach
            hls.loadSource(src)
            hls.attachMedia(video)

            return () => {
                hls.destroy()
                if (hlsRef.current === hls) {
                    hlsRef.current = null
                }
            }
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support detected; assigning src
            video.src = src
            const playOnMetadata = () => {
                void video.play().catch(() => undefined)
            }
            video.addEventListener('loadedmetadata', playOnMetadata)

            return () => {
                video.removeEventListener('loadedmetadata', playOnMetadata)
                video.removeAttribute('src')
                video.load()
            }
        } else {
            video.src = src

            return () => {
                video.removeAttribute('src')
                video.load()
            }
        }

    }, [src]);

    return (
        <div className="relative h-full w-full overflow-hidden bg-black">
            <video
                ref={videoRef}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full bg-black"
            />

            <span
                aria-hidden="true"
                className="lesson-video-watermark pointer-events-none absolute z-10 select-none text-sm font-semibold tracking-wide text-white/75"
            >
                {watermark}
            </span>
        </div>
    );
}