import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, User, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user data - would come from auth context in a real app
  const user = {
    username: "xameyz",
    name: "Xameyz",
    profilePicture:
      "/9j/4AAQSkZJRgABAQAAAQABAAD/4gKgSUNDX1BST0ZJTEUAAQEAAAKQbGNtcwQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAADhjcHJ0AAABQAAAAE53dHB0AAABkAAAABRjaGFkAAABpAAAACxyWFlaAAAB0AAAABRiWFlaAAAB5AAAABRnWFlaAAAB+AAAABRyVFJDAAACDAAAACBnVFJDAAACLAAAACBiVFJDAAACTAAAACBjaHJtAAACbAAAACRtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABwAAAAcAHMAUgBHAEIAIABiAHUAaQBsAHQALQBpAG4AAG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAMgAAABwATgBvACAAYwBvAHAAeQByAGkAZwBoAHQALAAgAHUAcwBlACAAZgByAGUAZQBsAHkAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEoAAAXj///zKgAAB5sAAP2H///7ov///aMAAAPYAADAlFhZWiAAAAAAAABvlAAAOO4AAAOQWFlaIAAAAAAAACSdAAAPgwAAtr5YWVogAAAAAAAAYqUAALeQAAAY3nBhcmEAAAAAAAMAAAACZmYAAPKnAAANWQAAE9AAAApbcGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltwYXJhAAAAAAADAAAAAmZmAADypwAADVkAABPQAAAKW2Nocm0AAAAAAAMAAAAAo9cAAFR7AABMzQAAmZoAACZmAAAPXP/bAEMABQMEBAQDBQQEBAUFBQYHDAgHBwcHDwsLCQwRDxISEQ8RERMWHBcTFBoVEREYIRgaHR0fHx8TFyIkIh4kHB4fHv/bAEMBBQUFBwYHDggIDh4UERQeHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHv/CABEIANgA2AMBIgACEQEDEQH/xAAcAAEAAwEBAQEBAAAAAAAAAAAABgcIBQQDAQL/xAAZAQEBAQEBAQAAAAAAAAAAAAAABAUDAgH/2gAMAwEAAhADEAAAAblAAAAAAAAAAAAAAAAAAAKaPym7LsnjHmvZUJzX66bKHSgAAAAAAAAAU0OIsqfPCfOAzXsqE5rs2dlDpQAAAAAAAKZP3icO6ec38OR15cwPPIARHpTTOyoTmujQ2UOlAAAAAACmbmpkhNx1bIJcqc8TqfbrX/DkdebNER9e0uBmrSuaulOyxRoAAAAAAKZuamSNSSNyuTK8E2hvz4xz3idT7Wa8OlxwgDnOzVpXNVGjssUaAAAAAACmbmpkjUrik1mzOd5/f4J4E9gU973/ADHGEBmrSuaqNHZYo0AAAAAAFM3NTJGprCpXNmPB7/BPCnsCnve75jjED4zVpXNVGjssUaAAAAAACmbmpkjUrhU1ly3g9/8APPh8JvCOr1q58u7Fc9O0uEmSzVpXNVGjssUaAAAAAACmbmpkiE1hUzmznw+/y+ePOJs3tzere32s58u7Fc0Xy7NWlc1eOWyxRoAAAAAAAUzEdKU155/XwRqWx4/nHKQDtzerakq1PzZZTpgAAAAAAAAUzEdKU155+VE5ZBhCpPfVsou3AAAAAAAAAAAKapnZYxpssAAAAAAAAAAAAAAAAAAAAP/EACMQAAEDAwQDAQEAAAAAAAAAAAAGB0ADBAUBEBQgAhIVYBP/2gAIAQEAAQUC/BOZKcwRElzBESXMEPJcwQ8lzROikMdIc0Tp94Upjo7miQPLx9T74pDHRnNEeVdvvClMdFc0R+3l4+u33xSRXNEftV3UsVzRHlfopYrmiPK/RSxXNEf1UsVzRH9KYmormiX31Khi7/gmLv8AnRHNEvtqVN8Xf8Exd/zobmiXNTQq9MXf8Exd/wA6G5gl++Lv+CYu/wCdDcwTB/OU5gl5bmCdluZ+F//EACYRAAAFAwQCAgMAAAAAAAAAAAABAgMEERMhEBIwQQUxMkIzQFD/2gAIAQMBAT8B/Udl21baBh+7XHJKf9t01Yfu1xxKO7ubDqNiqasM3K5DD92uOGQtbbhmkwakSE0SYdbtqoGGLlch9+5TAgd8MsqrMNura9A1IfTRIffuUxpA74ZPzMOFkeP+2sDvhk/Mw6PH+lA9IHfDJ/IYJq4ZEEPpYO0fXYcbKQRKSekDvhdRveoH17EG3pGkmgySo8BxspBEpJiD9uFxG9NBIaNKqawTWeK4LjcRvTtDzVtZpEaNern+H//EACQRAAEEAgICAQUAAAAAAAAAAAIAAQMREjAQQQQxISIyQEJQ/9oACAECAQE/AfxClxekB5bJT/XkDy1P9diiGnrkAyQHlpkdxK2VtI3wiHF6QBkjPJQd6ZfaEnD0raRvhGeXEHemT2iXj98wd6ZPaJeP3zB3pk+5MGT0mNgfF0QtI1txB3pJrNG9DjxHI7PT+kQtI1soO9LtbKQaeuYLfWTW1IxxelHHn/D/AP/EACwQAAACBwYGAwEAAAAAAAAAAADBBAURQIKDwgEDEBIgIwI0QoGj4RNBYDH/2gAIAQEABj8C/BK+ZS9K+ZSEuA3lXzKQlwG8q+ZSEuA3lXzKQlwG8q+ZSL+EwjxEOPs8K+ZSL+Exyvk9BHiIcfZ3V8ykJUJ4cr5PQR4iHH2dlfMpCVCYsw5XyegjxEOPs6q+ZSEqE9HK+T0EeInVXzKQlQnhZijxE6q+ZSEqExZoR4idVfMpCVCYs0I8ROqvmUhKhPSjxE6q+ZSEqE9Fov4TdVfMpCRCeiwXm1nzs6mC82vjyM+2uivmUhIhPGzG82s+dnUwXm1kyM6muavmUhIhPGzRebWfOz7YLza+PIz7a5q+ZSEiE9d5tZ87OpgvNrJkZ1Nc1fMpCRCY/r0r5lISITe1fMpF/wBje1fMp/C//8QAJRAAAQMCBgIDAQAAAAAAAAAAARExQAAgECFRYbHwMIFgwdFx/9oACAEBAAE/IfgZoaTaTbcaRnHNttI2i2y+kZmGbPDT/IJtoNodXvwl4BsoAwMIHV78BeAbaeUzVaVUbQ6vd5eAbMXA0wAdXu4vANmDymargqo24F4Bstcy4F4Bsp/fYy4F4Bsp/fYy4F4BstbLgXgGzxsQvANlqn4CCLsdaXcglXYaWl4BsuEWcEEXY60cuWCrsNLC8A2XjvyEkXY60u5BKuw0xLwbZeFnBBF2OtLuWCrsNKUwzNRQ6pcXi2y0ElXjmRIxRMm1OtKdfgf/2gAMAwEAAgADAAAAEPPPPPPPPPPPPPPPPPPPOIhPPPPPPPPPPOGgQ5PPPPPPPPPNSAABIfPPPPPPPGXyBYQvPPPPPPPB534QAvPPPPPPPFXKgQAvPPPPPPPFfqggAvPPPPPPPHPwrAQvPPPPPPPP6PGLA/PPPPPPPK8/fTXPPPPPPPPPK9/HPPPPPPPPPPPDHPPPPPPPPPPPPPPPPPPPPP/EACcRAAEDAgUEAgMAAAAAAAAAABEAASExQTBRcYHBEGGx0ZHxQFDh/9oACAEDAQE/EPxDMg79tFkQC5rifCJOj06M4WRALmuEZQAmtZon3zI9dXSQAssgAXOCFoQYazNmnDlLexkjBkelIOAFlAMAN1w84IZp4ZOrs8GtHTrcyt7GSgGAG/Sjbzgsm08MhlmqdnKevSjbzgui08MrF4nKZPSjbzgug08Mp9FU26fknvoo6E2+sk7BUbecEgYPpRaQJ3Z1VAoNNtexqo6E2+skwfDnBIGChDI/nVtd3YBpJvXDIECgw5HoqQcALGu/ZD9F/8QAJBEAAgIBBAEEAwAAAAAAAAAAAREAITAQMUHBoUBQcYGR0fD/2gAIAQIBAT8Q9IMqS/SWRLTQGX6SxG2yl+471XLSl2ksJ+TeEuDjmLlpShSU6sIsxGwJQnQcoUlp1YRvARc6O4dOrCd5xmz6dw6dWE7REynGoc+YAEqEKdWFsP7aPvLzoNEgAJUFfhhfCFQ1Op0OPnG2hu8vWlB7F//EACgQAAECBQMEAgMBAAAAAAAAAAEAESAhMUBxEEHBMFGh8GGRYIGx8f/aAAgBAQABPxD8CB5HKJFCiWxITtxJlDofOGqR0jW2EkyFAkSYUjliQnZiTICUCQ4GjSUDWyAlgD7ukKBcsSE7BPLT4vScqZsEFs6AgMkg3BdHypmxSWcmzIADMROSc39DlTNiguXjQIA2SDcRvKmbJBZybNoABmIaSd3xambJBcvGvhxdTNigvR+oPDi6mbFBej9QeHF1M2qC8GLqZtEFxco4vUzZpXYubhHIx23l4+NEQQvbf8+NnWGpmwTzdPYubjUpI918x8aIY+u+g2dYKmbBPNXsW5cvEBSMe7+Y+NEQQvV+PjZ11qZsCZDuI8pI918x8aIzn13yGzqvkP3ZEQWFBnJdiv2/1EZdvO0JkO4h3iave2IgsKHCLsdYzmZd+9wZEhIR8j7XyPv8D//Z",
    mimeType: "image/jpeg",
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const NavItems = () => (
    <>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 w-full justify-start"
        asChild
      >
        <Link to="/">
          <Home className="h-5 w-5" />
          <span className={cn(isMobile ? "" : "ml-2")}>Home</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center space-x-2 w-full justify-start"
        asChild
      >
        <Link to={`/profile/${user.username}`}>
          <User className="h-5 w-5" />
          <span className={cn(isMobile ? "" : "ml-2")}>Profile</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center space-x-2 w-full justify-start"
      >
        <LogOut className="h-5 w-5" />
        <span className={cn(isMobile ? "" : "ml-2")}>Logout</span>
      </Button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 border-r border-border p-4 flex flex-col space-y-4 fixed h-full">
          <div className="mb-6 px-2">
            <div className="text-twitter-blue text-2xl font-bold">Chirper</div>
          </div>

          <nav className="flex flex-col space-y-1">
            <NavItems />
          </nav>

          <div className="mt-auto">
            <div className="flex items-center space-x-2 p-2 rounded-full hover:bg-muted cursor-pointer twitter-transition">
              <img
                src={`data:${user.mimeType};base64,${user.profilePicture}`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div className="flex-1 hidden lg:block">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-muted-foreground">
                  @{user.username}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-14 border-b border-border bg-background/80 backdrop-blur-md z-50 flex items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <div className="text-twitter-blue text-xl font-bold">Chirper</div>

          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={`data:${user.mimeType};base64,${user.profilePicture}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
          onClick={toggleMobileMenu}
        >
          <div
            className="fixed left-0 top-14 bottom-0 w-64 bg-background border-r border-border p-4 animate-slide-right"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-1">
              <NavItems />
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isMobile ? "pt-14" : "ml-64"
        )}
      >
        <div className="max-w-2xl mx-auto h-full">{children}</div>
      </main>
    </div>
  );
}
