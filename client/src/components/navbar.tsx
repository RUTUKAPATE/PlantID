import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Leaf, User, LogOut, Camera, Stethoscope, BookOpen } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">PlantID</span>
              </div>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                <Link href="/">
                  <Button
                    variant={location === "/" ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Identify Plant</span>
                  </Button>
                </Link>
                
                <Link href="/disease-diagnosis">
                  <Button
                    variant={location === "/disease-diagnosis" ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>Plant Doctor</span>
                  </Button>
                </Link>
                
                <Link href="/my-plants">
                  <Button
                    variant={location === "/my-plants" ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>My Plants</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {getInitials(user?.firstName, user?.lastName, user?.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.username
                      }
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} disabled={isLoggingOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}