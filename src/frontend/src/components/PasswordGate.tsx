import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const CORRECT_PASSWORD = "2469";

interface PasswordGateProps {
  onSuccess: () => void;
}

export function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      onSuccess();
    } else {
      setError("Incorrect password. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword("");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.04 50) 0%, oklch(0.12 0.03 50) 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <motion.div
          animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-amber-600/30 bg-card shadow-2xl overflow-hidden"
        >
          {/* Header bar */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-500 px-6 py-5 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white/20 rounded-full p-3">
                <Lock className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-white leading-tight">
              Lakshmi Ganapathi Communications
            </h1>
            <p className="text-amber-100 text-sm mt-1 font-medium">
              Property Land Measurement Calculator
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-8">
            <p className="text-center text-muted-foreground text-sm mb-6">
              Enter password to access
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                data-ocid="password.input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="text-center text-lg tracking-widest border-amber-600/40 focus-visible:ring-amber-500"
                autoFocus
              />
              {error && (
                <motion.p
                  data-ocid="password.error_state"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs text-center leading-snug"
                >
                  {error}
                </motion.p>
              )}
              <Button
                data-ocid="password.submit_button"
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-base py-5"
              >
                Enter
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
