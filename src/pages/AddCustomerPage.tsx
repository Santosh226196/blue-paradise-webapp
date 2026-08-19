import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCustomerMutation } from "@/store/api/customersApi";
import { GlassCard, PrimaryButton } from "@/components/ui";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Gender } from "@/types";
import { IoArrowBack, IoPerson, IoPhonePortrait, IoCalendar, IoClipboard, IoLocationSharp, IoCard } from "react-icons/io5";

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

  const { register, handleSubmit, formState: { errors }, setError, watch, setValue } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
  });

  const aadhaarValue = watch("aadhaarNumber") ?? "";

  function formatAadhaar(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    const parts = [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12)];
    return parts.filter(Boolean).join(" ");
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
      };
      const result = await createCustomer(payload).unwrap();
      navigate(`/customers/${result.id}`);
    } catch {
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Customers", href: "/customers" },
        { label: "New Customer" }
      ]} />

      <div className="flex items-center gap-3 animate-fade-up">
        <button onClick={() => navigate(-1)}
          className="liquid-glass p-2.5 rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
        >
          <IoArrowBack size={20} style={{ color: "var(--text-primary)" }} />
        </button>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Add Customer</h1>
      </div>

      <GlassCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name + Mobile — side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }} htmlFor="name">
                <IoPerson size={12} /> Full Name *
              </label>
              <input id="name" {...register("name")}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]"
                style={inputStyle} placeholder="Enter full name"
              />
              {errors.name && <p className="text-xs font-medium" style={{ color: "var(--accent-coral)" }}>{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }} htmlFor="mobile">
                <IoPhonePortrait size={12} /> Mobile Number *
              </label>
              <input id="mobile" {...register("mobile")}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium font-mono transition-all duration-200 min-h-[48px]"
                style={inputStyle} placeholder="10-digit mobile number" maxLength={10}
              />
              {errors.mobile && <p className="text-xs font-medium" style={{ color: "var(--accent-coral)" }}>{errors.mobile.message}</p>}
            </div>
          </div>

          {/* Aadhaar */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }} htmlFor="aadhaar">
              <IoCard size={12} /> Aadhaar Number
            </label>
            <input id="aadhaarNumber"
              value={aadhaarValue}
              onChange={(e) => {
                const formatted = formatAadhaar(e.target.value);
                setValue("aadhaarNumber", formatted, { shouldValidate: true });
              }}
              className="w-full px-4 py-3.5 rounded-xl text-sm font-medium font-mono transition-all duration-200 min-h-[48px]"
              style={inputStyle} placeholder="XXXX XXXX XXXX" maxLength={14}
            />
            {errors.aadhaarNumber && <p className="text-xs font-medium" style={{ color: "var(--accent-coral)" }}>{errors.aadhaarNumber.message}</p>}
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Optional — 12-digit government ID number</p>
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }} htmlFor="age">
                <IoCalendar size={12} /> Age
              </label>
              <input id="age" type="number" {...register("age")}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]"
                style={inputStyle} placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }} htmlFor="gender">
                <IoClipboard size={12} /> Gender
              </label>
              <select id="gender" {...register("gender")}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]"
                style={inputStyle}
              >
                <option value="">Select</option>
                <option value={Gender.Male}>Male</option>
                <option value={Gender.Female}>Female</option>
                <option value={Gender.Other}>Other</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }} htmlFor="address">
              <IoLocationSharp size={12} /> Address
            </label>
            <textarea id="address" {...register("address")} rows={2}
              className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 resize-none"
              style={inputStyle} placeholder="Optional"
            />
          </div>

          <PrimaryButton type="submit" fullWidth size="lg" loading={isLoading}>
            Add Customer
          </PrimaryButton>
        </form>
      </GlassCard>
    </div>
  );
}
