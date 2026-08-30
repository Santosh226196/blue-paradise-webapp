import { useState, useRef, useEffect, useCallback } from "react";
import {
  IoCamera,
  IoClose,
  IoRefresh,
  IoCheckmark,
  IoImageOutline,
  IoWarningOutline,
  IoSyncOutline,
} from "react-icons/io5";
import type { CameraCaptureModalProps } from "@/types";

export function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  title = "Take Photo",
  guideMode = "avatar",
  initialFacingMode = "user",
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    initialFacingMode,
  );
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);

  // Check for camera devices
  useEffect(() => {
    if (!isOpen) return;
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter((d) => d.kind === "videoinput");
          setHasMultipleCameras(videoDevices.length > 1);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setIsLoadingCamera(true);
    setCameraError(null);

    // Stop existing stream first
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Camera API is not supported in this browser. Please upload a file instead.",
        );
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Unable to access camera. Please check permissions or upload a file.";
      setCameraError(
        errorMsg.includes("Permission denied") ||
          errorMsg.includes("NotAllowedError")
          ? "Camera permission was denied. Please allow camera access in browser settings or choose a photo from your device."
          : errorMsg,
      );
    } finally {
      setIsLoadingCamera(false);
    }
  }, [facingMode]);

  // Effect to manage stream lifecycle
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [isOpen, capturedImage, startCamera]);

  // Clean stop when modal closes
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setCameraError(null);
    onClose();
  };

  // Toggle front/back camera
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Capture snapshot from video
  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flash animation
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    // If front camera, mirror the image horizontally for natural look
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);

    // Stop video track temporarily to save power
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Confirm photo
  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  // Fallback file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#061017]/95 shadow-2xl backdrop-blur-2xl animate-scale-in"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(95, 217, 214, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
              <IoCamera size={18} />
            </div>
            <h3 className="font-display text-base font-bold text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Camera Viewport / Captured Preview */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-950">
          {flashEffect && (
            <div className="absolute inset-0 z-30 bg-white transition-opacity duration-200" />
          )}

          {capturedImage ? (
            /* Review Captured Photo */
            <div className="relative flex h-full w-full items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured"
                className="h-full w-full object-contain"
              />
              <div className="absolute top-3 left-3 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                Photo Ready
              </div>
            </div>
          ) : cameraError ? (
            /* Error / Permission State */
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
                <IoWarningOutline size={30} />
              </div>
              <h4 className="text-sm font-bold text-white">
                Camera Unavailable
              </h4>
              <p className="mt-1.5 text-xs text-slate-400 max-w-xs">
                {cameraError}
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-400/20 cursor-pointer"
                >
                  <IoRefresh size={14} /> Retry Camera
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/10 cursor-pointer"
                >
                  <IoImageOutline size={14} /> Upload Image
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Stream */
            <div className="relative h-full w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
              />

              {/* Viewfinder Guide Overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {guideMode === "avatar" && (
                  <div className="relative flex flex-col items-center">
                    <div className="h-44 w-44 rounded-full border-2 border-dashed border-cyan-300/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] backdrop-blur-[0.5px]" />
                    <span className="mt-2.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-cyan-200 backdrop-blur-sm">
                      Align Face Here
                    </span>
                  </div>
                )}

                {guideMode === "document" && (
                  <div className="relative flex flex-col items-center w-full px-8">
                    <div className="h-48 w-full max-w-xs rounded-2xl border-2 border-dashed border-cyan-300/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] backdrop-blur-[0.5px]" />
                    <span className="mt-2.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-cyan-200 backdrop-blur-sm">
                      Align ID Card / Document
                    </span>
                  </div>
                )}
              </div>

              {/* Top Controls Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {hasMultipleCameras && (
                  <button
                    type="button"
                    onClick={handleToggleCamera}
                    title="Flip camera"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 active:scale-95 cursor-pointer"
                  >
                    <IoSyncOutline size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoadingCamera && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 text-cyan-300">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <span className="text-xs font-medium">Starting Camera...</span>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Canvas & File Input */}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#0A1A24] px-6 py-4">
          {capturedImage ? (
            /* Review Actions */
            <div className="flex w-full items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-slate-200 transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
              >
                <IoRefresh size={16} /> Retake
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 to-teal-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <IoCheckmark size={18} /> Use This Photo
              </button>
            </div>
          ) : (
            /* Capture Actions */
            <div className="flex w-full items-center justify-between">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <IoImageOutline size={16} />
                <span className="hidden sm:inline">From Files</span>
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                disabled={isLoadingCamera || !!cameraError}
                onClick={handleTakePhoto}
                className="group relative flex h-16 w-16 items-center justify-center rounded-full p-1 transition-all active:scale-95 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 rounded-full border-2 border-cyan-400 transition-all group-hover:scale-105 group-hover:border-cyan-300" />
                <span className="h-12 w-12 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50 transition-all group-hover:scale-95 group-hover:bg-cyan-300" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
