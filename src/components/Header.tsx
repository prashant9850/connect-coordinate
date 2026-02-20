import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Building2,
  Menu,
  X,
  AlertTriangle,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { EmergencyButton } from "./EmergencyButton";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRef } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/programs", label: "Programs", icon: MapPin },
  { href: "/volunteers", label: "Volunteers", icon: Users },
  { href: "/ngos", label: "NGOs", icon: Building2 },
];

export function Header({ onEmergencyClick }: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, setUser } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const channelRef = useRef<any>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">
              Disaster<span className="text-destructive">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                  location.pathname === href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3 relative">
            {/* SOS Button */}
            <EmergencyButton
              size="default"
              onClick={onEmergencyClick}
              showPulse={false}
            />

            {/* 🔔 Notifications — only when logged in */}
            {user && (
              <Link to="/notifications">
                <button className="relative p-2 rounded-lg hover:bg-muted">
                  <Bell className="h-5 w-5" />
                </button>
              </Link>
            )}

            {/* 🔹 Logged In User */}
            {user && profile ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm"
                >
                  {profile.name?.charAt(0).toUpperCase()}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-card border border-border rounded-xl shadow-lg z-50 p-5 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Name & Email */}
                    <div className="mb-3">
                      <p className="font-semibold text-foreground text-sm">
                        {profile.name}
                      </p>
                      <p className="text-xs text-muted-foreground break-all mt-1">
                        {profile.email}
                      </p>
                    </div>

                    <div className="border-t border-border my-3" />

                    {/* Role */}
                    <p className="text-xs text-muted-foreground capitalize mb-2">
                      Role: {profile.role}
                    </p>

                    {/* Phone */}
                    {profile.phone && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Phone: {profile.phone}
                      </p>
                    )}

                    {/* Skills */}
                    {profile.role === "volunteer" &&
                      profile.skills &&
                      profile.skills.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-2">
                            Skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill: string) => (
                              <span
                                key={skill}
                                className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize"
                              >
                                {skill.replace("_", " ")}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="border-t border-border my-4" />

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* 🔹 Not Logged In */
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
