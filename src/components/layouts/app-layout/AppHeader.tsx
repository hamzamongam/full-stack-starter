import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Search, Shield, ShoppingCart, User } from "lucide-react";
import { type FC, useState } from "react";
import { BaseButton } from "@/components/base/button/BaseButton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CartDrawer } from "@/features/store/ui/components/CartDrawer";
import { useCart } from "@/features/store/ui/hooks/useCartStore";

const AppHeader: FC = () => {
	const { session, handleLogout } = useAuth();
	const { totalItems, openDrawer } = useCart();
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!search.trim()) return;
		navigate({
			to: "/shop",
			search: { search: search.trim() },
		});
		setSearch(""); // Clear search after navigation
	};

	return (
		<header className="sticky top-0 z-50 w-full bg-[#032F2D] text-white">
			<div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4 md:gap-8">
				{/* Logo with Box */}
				<Link to="/" className="flex items-center shrink-0">
					<img src="/logo.svg" alt="Seagle" className="" />
				</Link>

				{/* Search Bar - Desktop */}
				<form
					onSubmit={handleSearch}
					className="hidden md:flex  flex-1  relative"
				>
					<input
						type="text"
						placeholder="Search for anything related fishing"
						className="w-full bg-white text-foreground rounded-none py-2.5 px-4 pr-12 focus:outline-none"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button
						type="submit"
						className="absolute right-0 top-0 h-full w-12 flex items-center justify-center border-l border-gray-100 hover:bg-gray-50 transition-colors"
					>
						<Search className="w-5 h-5 text-[#00C2B8]" />
					</button>
				</form>

				{/* Actions */}
				<div className="flex items-center gap-2 md:gap-4">
					{session ? (
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<button
										type="button"
										className="flex items-center gap-2 hover:bg-white/10 p-1.5 pr-3 rounded-full transition-colors outline-hidden focus-visible:ring-1 focus-visible:ring-white/50"
									>
										<div className="h-7 w-7 rounded-full bg-[#00C2B8] flex items-center justify-center text-[#032F2D] font-bold text-sm select-none">
											{session.user.name.charAt(0).toUpperCase()}
										</div>
										<span className="hidden sm:block text-sm font-medium">
											{session.user.name.split(" ")[0]}
										</span>
									</button>
								}
							></DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-56 mt-2 rounded-2xl p-2 bg-white shadow-2xl border border-gray-100 text-gray-800"
							>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="font-normal p-2">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-bold leading-none text-gray-900">
												{session.user.name}
											</p>
											<p className="text-xs leading-none text-gray-500 mt-1 text-ellipsis overflow-hidden">
												{session.user.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator className="bg-gray-100" />
									{session.user.role === "admin" && (
										<>
											<DropdownMenuItem
												render={
													<Link
														to="/admin"
														className="flex items-center w-full"
													>
														<Shield className="mr-2 h-4 w-4 opacity-70 group-hover:opacity-100" />
														<span className="font-medium">Admin Panel</span>
													</Link>
												}
												className="rounded-xl px-2 py-2.5 hover:bg-[#00C2B8]/10 hover:text-[#032F2D] transition-colors cursor-pointer group mt-1"
											></DropdownMenuItem>
											<DropdownMenuSeparator className="bg-gray-100" />
										</>
									)}
									<DropdownMenuItem
										render={
											<Link to="/my-account" className="flex items-center w-full">
												<User className="mr-2 h-4 w-4 opacity-70 group-hover:opacity-100" />
												<span className="font-medium">My Profile</span>
											</Link>
										}
										className="rounded-xl px-2 py-2.5 hover:bg-[#00C2B8]/10 hover:text-[#032F2D] transition-colors cursor-pointer group mt-1"
									></DropdownMenuItem>
									<DropdownMenuSeparator className="bg-gray-100" />
									<DropdownMenuItem
										onClick={handleLogout}
										className="rounded-xl px-2 py-2.5 hover:bg-red-50 hover:text-red-700 text-red-600 transition-colors cursor-pointer group mt-1"
									>
										<LogOut className="mr-2 h-4 w-4 opacity-70 group-hover:opacity-100" />
										<span className="font-medium">Log out</span>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Link to="/login">
							<BaseButton
								variant="primary"
								className="font-bold h-10 px-8 rounded-none border-none"
							>
								Login
							</BaseButton>
						</Link>
					)}

					<BaseButton
						variant="ghost"
						className="flex items-center gap-2 text-white hover:text-white  hover:bg-white/10 shrink-0 h-10 px-3 rounded-none relative overflow-visible"
						onClick={openDrawer}
						leftIcon={
							<div className="relative">
								<ShoppingCart className="w-5 h-5 text-white" />
								{totalItems > 0 && (
									<span className="absolute -top-2 -right-2 bg-[#00C2B8] text-[#032F2D] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#032F2D]">
										{totalItems}
									</span>
								)}
							</div>
						}
					>
						<span className="font-bold text-sm hidden sm:inline">Cart</span>
					</BaseButton>

					{/* Mobile Menu & Search Icon */}
					<div className="md:hidden flex items-center gap-2">
						<Sheet>
							<SheetTrigger
								className="p-2 hover:bg-white/10 rounded-md transition-colors"
								aria-label="Open Menu"
							>
								<Menu className="w-6 h-6 text-white" />
							</SheetTrigger>
							<SheetContent
								side="right"
								className="bg-[#032F2D] text-white border-white/10"
							>
								<nav className="flex flex-col gap-6 mt-12 text-lg font-medium">
									<Link
										to="/"
										className="text-white hover:text-[#00C2B8] transition-colors"
									>
										Home
									</Link>
									<Link
										to="/shop"
										className="text-white hover:text-[#00C2B8] transition-colors"
									>
										Shop
									</Link>
									<Link
										to="/login"
										className="text-white hover:text-[#00C2B8] transition-colors"
									>
										Login
									</Link>
									<Link
										to="/admin/products"
										className="text-white hover:text-[#00C2B8] transition-colors"
									>
										Admin
									</Link>
								</nav>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
			<CartDrawer />
		</header>
	);
};

export default AppHeader;
