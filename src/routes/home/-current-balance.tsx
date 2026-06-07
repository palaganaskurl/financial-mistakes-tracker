import { Link } from "@tanstack/react-router";

interface CurrentBalanceProps {
	balance: number;
}

export default function CurrentBalance({ balance }: CurrentBalanceProps) {
	return (
		<Link to="/home/accounts">
			<div className="border rounded-lg p-4 border-gray-200 cursor-pointer transition-all hover:border-blue-400 hover:shadow-[0_0_0_3px_rgba(66,153,225,0.1)]">
				<p className="text-sm font-medium mb-2">Balance</p>
				<p className="text-lg font-bold">
					{new Intl.NumberFormat("en-PH", {
						style: "currency",
						currency: "PHP",
					}).format(balance)}
				</p>
			</div>
		</Link>
	);
}
