import { useState } from "react";
import { CreditCard, Building2, AlertTriangle, X, Loader2 } from "lucide-react";

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000];
const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Debit/Credit Card",
    sub: "Visa, Mastercard, Verve",
    icon: CreditCard,
  },
  {
    id: "transfer",
    label: "Bank Transfer",
    sub: "Direct bank transfer",
    icon: Building2,
  },
];
const FREQUENCY_OPTIONS = [
  { id: "one-time", label: "One-Time", sub: "Make a single donation" },
  { id: "monthly", label: "Monthly", sub: "Recurring monthly donation" },
];

const selectedStyle = {
  border: "2px solid var(--color-primary)",
  background: "#F0FDF4",
};
const unselectedStyle = { border: "2px solid #E5E7EB", background: "white" };

export default function DonationForm() {
  const [frequency, setFrequency] = useState("one-time");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isCustom = selectedAmount === "custom";
  const finalAmount = isCustom ? customAmount : selectedAmount;
  const emailRequired = paymentMethod === "card";
  const hasValidEmail = /\S+@\S+\.\S+/.test(donorEmail.trim());
  const canProceed =
    finalAmount &&
    paymentMethod &&
    (!emailRequired || hasValidEmail);

  const handleSubmit = async () => {
    if (!canProceed) return;
    setLoading(true);

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(finalAmount),
          frequency,
          paymentMethod,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (paymentMethod === "card") {
          window.location.href = data.data.authorization_url;
        } else {
          alert(
            "Donation recorded. Please transfer to the account details shown below.",
          );
        }
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mx-auto max-w-[580px] rounded-2xl bg-white p-5 sm:p-8"
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}
    >
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#111827",
          textAlign: "center",
          marginBottom: "1.75rem",
        }}
      >
        Complete Your Donation
      </h2>

      {/* Donation Frequency */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "#374151",
            marginBottom: "0.625rem",
          }}
        >
          Donation Frequency
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFrequency(opt.id)}
              style={{
                padding: "0.875rem 1rem",
                borderRadius: "0.75rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "border-color 200ms, background 200ms",
                ...(frequency === opt.id ? selectedStyle : unselectedStyle),
              }}
            >
              <p
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {opt.label}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#9CA3AF",
                  marginTop: "0.125rem",
                }}
              >
                {opt.sub}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Donation Amount */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "#374151",
            marginBottom: "0.625rem",
          }}
        >
          Donation Amount (₦)
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setSelectedAmount(amount)}
              style={{
                padding: "0.75rem 0.5rem",
                borderRadius: "0.75rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "border-color 200ms, background 200ms, color 200ms",
                color:
                  selectedAmount === amount
                    ? "var(--color-primary)"
                    : "#374151",
                ...(selectedAmount === amount
                  ? selectedStyle
                  : unselectedStyle),
              }}
            >
              ₦{amount.toLocaleString()}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedAmount("custom")}
            style={{
              padding: "0.75rem 0.5rem",
              borderRadius: "0.75rem",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "border-color 200ms, background 200ms, color 200ms",
              color: isCustom ? "var(--color-primary)" : "#374151",
              ...(isCustom ? selectedStyle : unselectedStyle),
            }}
          >
            Custom
          </button>
        </div>

        {isCustom && (
          <div style={{ marginTop: "0.75rem" }}>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="form-input"
              placeholder="Enter amount in ₦"
              min={100}
            />
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "#374151",
            marginBottom: "0.625rem",
          }}
        >
          Payment Method
        </p>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}
        >
          {PAYMENT_METHODS.map(({ id, label, sub, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setPaymentMethod(id);
                if (id === "transfer") {
                  setTimeout(() => {
                    document
                      .getElementById("bank-transfer-details")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 120);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                borderRadius: "0.75rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "border-color 200ms, background 200ms",
                ...(paymentMethod === id ? selectedStyle : unselectedStyle),
              }}
            >
              <div className="icon-box-sm">
                <Icon size={16} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {label}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "0.625rem",
              }}
            >
              Full Name
            </p>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="form-input"
              placeholder="Your name"
            />
          </div>

          <div>
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "0.625rem",
              }}
            >
              Email Address {emailRequired ? "*" : ""}
            </p>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              className="form-input"
              placeholder="you@example.com"
              required={emailRequired}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      {!canProceed ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.875rem 1rem",
            borderRadius: "0.75rem",
            background: "#D1D5DC",
            color: "#6A7282",
            fontSize: "0.875rem",
          }}
        >
          <AlertTriangle size={15} />
          {emailRequired
            ? "Select an amount and enter a valid email to continue"
            : "Select an amount to continue"}
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.9rem",
            borderRadius: "0.75rem",
            background: loading ? "#D1D5DC" : "var(--color-btn-orange)",
            color: "white",
            fontSize: "1rem",
            fontWeight: 600,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 200ms",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
          onMouseEnter={(e) => {
            if (!loading)
              e.currentTarget.style.background = "var(--color-btn-orange-dark)";
          }}
          onMouseLeave={(e) => {
            if (!loading)
              e.currentTarget.style.background = "var(--color-btn-orange)";
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading
            ? "Processing..."
            : `Donate ₦${Number(finalAmount).toLocaleString()}`}
        </button>
      )}
    </div>
  );
}
