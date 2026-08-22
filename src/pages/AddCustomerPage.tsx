import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCustomerMutation } from "@/store/api/customersApi";
import { GlassCard, PrimaryButton, CameraCaptureModal, Modal } from "@/components/ui";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Gender } from "@/types";
import { useToast } from "@/components/Toast";
import {
  IoArrowBack,
  IoPerson,
  IoPhonePortrait,
  IoCalendar,
  IoClipboard,
  IoLocationSharp,
  IoCard,
  IoCamera,
  IoTrashOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  aadhaarNumber: z.string().regex(/^\d{4}\s?\d{4}\s?\d{4}$/, "Enter a valid 12-digit Aadhaar number (XXXX XXXX XXXX)").optional().or(z.literal("")),
  age: z.coerce.number().min(1).max(120).optional().or(z.literal("")),
  gender: z.nativeEnum(Gender).optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

type CustomerForm = z.infer<typeof customerSchema>;

export function AddCustomerPage() {
  const navigate = useNavigate();
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [idCardPhoto, setIdCardPhoto] = useState<string | null>(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<"avatar" | "idCard">("avatar");
  const { showToast } = useToast();
  const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const { register, handleSubmit, formState: { errors }, setError, watch, setValue } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
  });

  const aadhaarValue = watch("aadhaarNumber") ?? "";

  function formatAadhaar(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    const parts = [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12)];
    return parts.filter(Boolean).join(" ");
  }

  function openCameraFor(target: "avatar" | "idCard") {
    setCameraTarget(target);
    setCameraModalOpen(true);
  }

  function handleCapturedPhoto(dataUrl: string) {
    if (cameraTarget === "avatar") {
      setAvatarPhoto(dataUrl);
    } else {
      setIdCardPhoto(dataUrl);
    }
  }

  async function onSubmit(data: CustomerForm) {
    try {
      const payload = {
        name: data.name,
        mobile: data.mobile,
        aadhaarNumber: data.aadhaarNumber || undefined,
        age: data.age ? Number(data.age) : undefined,
        gender: data.gender || undefined,
        address: data.address || undefined,
        photoUrl: avatarPhoto || undefined,
        idCardPhoto: idCardPhoto || undefined,
      };
      const result = await createCustomer(payload).unwrap();
      showToast("success", `${result.name} registered successfully!`);
      navigate(`/customers/${result.id}`);
    } catch {
      showToast("error", "A customer with this mobile already exists.");
      setErrorModal({ open: true, message: "A customer with this mobile number already exists in the system. Please use a different mobile number." });
      setError("mobile", { message: "A customer with this mobile already exists" });
    }
  }

  const inputStyle = {
    background: "var(--input-bg)",
    border: "1.5px solid var(--input-border)",
    color: "var(--text-primary)",
    outlineColor: "var(--input-focus-ring)",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-0 sm:px-0">
      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handleCapturedPhoto}
        title={cameraTarget === "avatar" ? "Capture Customer Photo" : "Capture ID / Aadhaar Document"}
        guideMode={cameraTarget === "avatar" ? "avatar" : "document"}
        initialFacingMode={cameraTarget === "avatar" ? "user" : "environment"}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Customers", href: "/customers" },
        { label: "New Customer" }
      ]} />

      <div className="flex items-center gap-3 animate-fade-up">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="liquid-glass p-2.5 rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 border border-white/10"
        >
          <IoArrowBack size={20} style={{ color: "var(--text-primary)" }} />
        </button>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Register New Member
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add member details and capture verification photos
          </p>
        </div>
      </div>

      <GlassCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Capture Section */}
          <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Verification & Photos
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Capture customer face & ID document with live camera
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Profile Photo Box */}
              <div className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-xl border border-dashed border-white/20 bg-black/20 text-center">
                {avatarPhoto ? (
                  <div className="relative mb-3 group">
                    <img
                      src={avatarPhoto}
                      alt="Customer Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400 shadow-md shadow-cyan-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setAvatarPhoto(null)}
                      className="absolute -top-1 -right-1 p-1.5 rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors"
                      title="Remove photo"
                    >
                      <IoTrashOutline size={14} />
                    </button>
                    <span className="absolute bottom-0 right-0 p-1 rounded-full bg-emerald-500 text-white">
                      <IoCheckmarkCircle size={14} />
                    </span>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-cyan-400/10 text-cyan-300 mb-3 border border-cyan-400/30">
                    <IoPerson size={32} />
                  </div>
                )}

                <p className="text-xs font-bold text-white mb-2">Member Photo</p>
                <button
                  type="button"
                  onClick={() => openCameraFor("avatar")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <IoCamera size={16} />
                  <span>{avatarPhoto ? "Retake Face Photo" : "Click Face Photo"}</span>
                </button>
              </div>

              {/* ID Document Photo Box */}
              <div className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-xl border border-dashed border-white/20 bg-black/20 text-center">
                {idCardPhoto ? (
                  <div className="relative mb-3 group w-full max-w-[160px] aspect-3/2">
                    <img
                      src={idCardPhoto}
                      alt="ID Document"
                      className="w-full h-full rounded-xl object-cover border-2 border-cyan-400 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setIdCardPhoto(null)}
                      className="absolute -top-1 -right-1 p-1.5 rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors"
                      title="Remove ID photo"
                    >
                      <IoTrashOutline size={14} />
                    </button>
                    <span className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 text-white">
                      <IoCheckmarkCircle size={14} />
                    </span>
                  </div>
                ) : (
                  <div className="w-20 h-14 rounded-xl flex items-center justify-center bg-cyan-400/10 text-cyan-300 mb-3 border border-cyan-400/30">
                    <IoCard size={28} />
                  </div>
                )}

                <p className="text-xs font-bold text-white mb-2">ID / Aadhaar Document</p>
                <button
                  type="button"
                  onClick={() => openCameraFor("idCard")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <IoCamera size={16} />
                  <span>{idCardPhoto ? "Retake ID Photo" : "Click ID Card"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Name + Mobile — side by side on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="name">
                <IoPerson size={13} className="text-cyan-400" /> Full Name *
              </label>
              <input
                id="name"
                {...register("name")}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]"
                style={inputStyle}
                placeholder="Enter full legal name"
              />
              {errors.name && <p className="text-xs font-medium text-rose-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="mobile">
                <IoPhonePortrait size={13} className="text-cyan-400" /> Mobile Number *
              </label>
              <input
                id="mobile"
                {...register("mobile")}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium font-mono transition-all duration-200 min-h-[48px]"
                style={inputStyle}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
              {errors.mobile && <p className="text-xs font-medium text-rose-400">{errors.mobile.message}</p>}
            </div>
          </div>

          {/* Aadhaar Number */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="aadhaarNumber">
              <IoCard size={13} className="text-cyan-400" /> Aadhaar / Government ID Number
            </label>
            <input
              id="aadhaarNumber"
              value={aadhaarValue}
              onChange={(e) => {
                const formatted = formatAadhaar(e.target.value);
                setValue("aadhaarNumber", formatted, { shouldValidate: true });
              }}
              className="w-full px-4 py-3.5 rounded-xl text-sm font-medium font-mono transition-all duration-200 min-h-[48px]"
              style={inputStyle}
              placeholder="XXXX XXXX XXXX"
              maxLength={14}
            />
            {errors.aadhaarNumber && <p className="text-xs font-medium text-rose-400">{errors.aadhaarNumber.message}</p>}
            <p className="text-[11px] text-slate-400">Optional — 12-digit UIDAI Aadhaar ID</p>
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="age">
                <IoCalendar size={13} className="text-cyan-400" /> Age
              </label>
              <input
                id="age"
                type="number"
                {...register("age")}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]"
                style={inputStyle}
                placeholder="Years"
                min={1}
                max={120}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="gender">
                <IoClipboard size={13} className="text-cyan-400" /> Gender
              </label>
              <select
                id="gender"
                {...register("gender")}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]"
                style={inputStyle}
              >
                <option value="">Select Gender</option>
                <option value={Gender.Male}>Male</option>
                <option value={Gender.Female}>Female</option>
                <option value={Gender.Other}>Other</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="address">
              <IoLocationSharp size={13} className="text-cyan-400" /> Residential Address
            </label>
            <textarea
              id="address"
              {...register("address")}
              rows={2}
              className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 resize-none"
              style={inputStyle}
              placeholder="Flat / Street / Landmark / Area"
            />
          </div>

          <PrimaryButton type="submit" fullWidth size="lg" loading={isLoading}>
            Register Customer
          </PrimaryButton>
        </form>
      </GlassCard>

      <Modal
        isOpen={errorModal.open}
        onClose={() => setErrorModal({ open: false, message: "" })}
        variant="error"
        title="Registration Failed"
        message={errorModal.message}
      />
    </div>
  );
}
