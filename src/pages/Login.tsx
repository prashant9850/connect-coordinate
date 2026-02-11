import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      /* ---------- AUTH LOGIN ---------- */
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error; // wrong email or password
      }

      if (!data.user) {
        throw new Error("Login failed");
      }

      const userId = data.user.id;

      /* ---------- FETCH ROLE ---------- */
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        throw new Error("Profile not found");
      }

      /* ---------- ROLE-BASED REDIRECT ---------- */
      if (profile.role === "ngo") {
        navigate("/dashboard"); // NGO dashboard (restricted UI inside)
      } else if (profile.role === "volunteer") {
        navigate("/dashboard"); // Volunteer dashboard (restricted UI inside)
      } else {
        throw new Error("Invalid user role");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M54%2028h-4v-4h-4v4h-4v4h4v4h4v-4h4v-4z%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />

        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 rounded-lg bg-destructive">
                <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
              </div>
              <span className="font-bold text-2xl">DisasterConnect</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Welcome back to
              <br />
              <span className="text-destructive">coordinated relief</span>
            </h1>

            <p className="text-primary-foreground/70 text-lg">
              Continue your mission to help those in need. Your skills and
              dedication make a difference.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-auto">
            <div className="p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
              <p className="text-3xl font-bold">1,200+</p>
              <p className="text-sm text-primary-foreground/70">
                Active volunteers
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
              <p className="text-3xl font-bold">48h</p>
              <p className="text-sm text-primary-foreground/70">
                Avg response time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
              <div className="p-2 rounded-lg bg-primary">
                <AlertTriangle className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">DisasterConnect</span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Sign in to your account
              </h2>
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Register here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Email address</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
