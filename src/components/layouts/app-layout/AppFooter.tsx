import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

export function AppFooter() {
	return (
		<footer className="w-full">
			{/* Main Footer Content */}
			<div className="bg-[#032F2D] text-white py-16">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-12">
						{/* Logo & Tagline */}
						<div className="space-y-8 col-span-1 md:col-span-2">
							<Link to="/" className="inline-block">
								<span className="font-extrabold text-3xl tracking-tighter text-[#00C2B8]">
									SEAGLE
								</span>
							</Link>
							<p className="text-white/60 text-lg leading-relaxed max-w-[280px]">
								Best if Seagle is a well-known name and you want to emphasize
								trust and engineering.
							</p>
						</div>

						{/* Quick Links Column */}
						<div className="space-y-6">
							<h4 className="text-[#00C2B8] text-sm font-bold uppercase tracking-widest">
								Quick Links
							</h4>
							<ul className="space-y-4 text-xs font-bold uppercase tracking-tight text-white/80">
								<li>
									<Link
										to="/"
										className="hover:text-[#00C2B8] transition-colors"
									>
										Home
									</Link>
								</li>
								<li>
									<Link
										to="/login"
										className="hover:text-[#00C2B8] transition-colors"
									>
										Login
									</Link>
								</li>
							</ul>
						</div>

						{/* Address Column */}
						<div className="space-y-6">
							<h4 className="text-[#00C2B8] text-sm font-bold uppercase tracking-widest">
								Address
							</h4>
							<div className="space-y-4 text-xs font-bold uppercase tracking-tight text-white/80">
								<p className="leading-relaxed">
									#122, JUBILEE ROAD
									<br />
									KOTAKKAL, MALAPPURAM, KERALA
									<br />
									INDIA, 676507
								</p>
								<div className="pt-2">
									<a
										href="mailto:info@seagle.in"
										className="inline-block border-b border-[#00C2B8] pb-0.5 text-[#00C2B8] normal-case font-medium text-sm"
									>
										info@seagle.in
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="bg-black text-white py-6">
				<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] font-medium tracking-wide">
					<p className="text-white/40">
						© Copyright 2026 seagle. All Rights Reserved.
					</p>
					<div className="flex gap-6 items-center">
						<Link
							to="/"
							className="text-white hover:text-[#00C2B8] transition-colors"
						>
							<Facebook className="w-5 h-5 fill-white" />
						</Link>
						<Link
							to="/"
							className="text-white hover:text-[#00C2B8] transition-colors"
						>
							<Instagram className="w-5 h-5" />
						</Link>
						<Link
							to="/"
							className="text-white hover:text-[#00C2B8] transition-colors"
						>
							<MessageCircle className="w-5 h-5 fill-white" />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
