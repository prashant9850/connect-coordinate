import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowLeft,
  Users,
  Building2,
  Check,
} from "lucide-react";
import type { VolunteerSkill } from "@/types";
import { supabase } from "@/lib/supabase";

/* ---------------- TYPES ---------------- */
type UserType = "volunteer" | "ngo";

/* ---------------- SKILLS ---------------- */
const skills: { value: VolunteerSkill; label: string }[] = [
  { value: "medical", label: "Medical" },
  { value: "rescue", label: "Search & Rescue" },
  { value: "first_aid", label: "First Aid" },
  { value: "logistics", label: "Logistics" },
  { value: "transport", label: "Transport" },
  { value: "communication", label: "Communication" },
  { value: "shelter", label: "Shelter Management" },
  { value: "food_distribution", label: "Food Distribution" },
];

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "ngo" ? "ngo" : "volunteer";

  const [userType, setUserType] = useState<UserType>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<VolunteerSkill[]>([]);

  /* ---------------- SKILL TOGGLE ---------------- */
  const toggleSkill = (skill: VolunteerSkill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string | null;

    const manpowerRaw = formData.get("manpower");
    const manpower =
      manpowerRaw && manpowerRaw !== "" ? Number(manpowerRaw) : null;

    try {
      /* ---------- AUTH ---------- */
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      const userId = authData.user.id;

      /* ---------- PROFILES ---------- */
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        role: userType,
        name,
        phone,
        location,
      });

      if (profileError) throw profileError;

      /* ---------- ROLE TABLE ---------- */
      if (userType === "volunteer") {
        const { error } = await supabase.from("volunteers").insert({
          id: userId, // ✅ correct FK
          skills: selectedSkills,
          availability: "available",
        });
        if (error) throw error;
      }

      if (userType === "ngo") {
        const { error } = await supabase.from("ngos").insert({
          id: userId,
          ngo_name: name,
          description,
          manpower,
        });
        if (error) throw error;
      }

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HEADER ================= */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">DisasterConnect</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* ================= ROLE SELECT ================= */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Volunteer */}
          <button
            type="button"
            onClick={() => setUserType("volunteer")}
            className={cn(
              "p-6 rounded-xl border-2 text-left transition-all",
              userType === "volunteer"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                userType === "volunteer"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary",
              )}
            >
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Volunteer</h3>
            <p className="text-sm text-muted-foreground">Join relief efforts</p>
            {userType === "volunteer" && (
              <div className="mt-3 flex items-center gap-1 text-primary text-sm">
                <Check className="h-4 w-4" />
                Selected
              </div>
            )}
          </button>

          {/* NGO */}
          <button
            type="button"
            onClick={() => setUserType("ngo")}
            className={cn(
              "p-6 rounded-xl border-2 text-left transition-all",
              userType === "ngo"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                userType === "ngo"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary",
              )}
            >
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">NGO / Organization</h3>
            <p className="text-sm text-muted-foreground">
              Coordinate relief programs
            </p>
            {userType === "ngo" && (
              <div className="mt-3 flex items-center gap-1 text-primary text-sm">
                <Check className="h-4 w-4" />
                Selected
              </div>
            )}
          </button>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                {userType === "volunteer" ? "Full Name" : "Organization Name"}
              </Label>
              <Input name="name" required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="phone" required />
            </div>
            <div className="space-y-2">
              <Label>
                {userType === "volunteer" ? "Location" : "Area of Operation"}
              </Label>
              <Input name="location" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Volunteer Skills */}
          {userType === "volunteer" && (
            <div className="space-y-3">
              <Label>Skills</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {skills.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => toggleSkill(s.value)}
                    className={cn(
                      "p-3 rounded-lg border text-sm",
                      selectedSkills.includes(s.value)
                        ? "bg-primary text-primary-foreground"
                        : "border-border",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* NGO Fields */}
          {userType === "ngo" && (
            <>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  name="description"
                  className="w-full min-h-[100px] rounded-md border p-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Manpower</Label>
                <Input name="manpower" type="number" />
              </div>
            </>
          )}

          {/* Terms */}
          <div className="flex gap-2">
            <Checkbox required />
            <span className="text-sm text-muted-foreground">
              I agree to the Terms & Privacy Policy
            </span>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
