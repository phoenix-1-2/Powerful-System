import { useEffect, useState } from 'react';

export default function Header({ dailyPoints, setDailyPoints }) {
	const [temp, setTemp] = useState(String(dailyPoints));
	useEffect(() => setTemp(String(dailyPoints)), [dailyPoints]);

	return (
		<div className="sticky top-0 z-50 bg-gradient-to-r from-fuchsia-900/40 via-black to-pink-900/30 backdrop-blur-md p-5 rounded-xl flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-3 border border-zinc-800">
			<div>
				<h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-fuchsia-400 via-pink-500 to-rose-400 bg-clip-text text-transparent tracking-tight">Powerful System</h1>
				<p className="text-sm text-zinc-300 mt-1">TAKE COMMAND OF THE LIFE IN YOUR HANDS</p>
			</div>
			<div className="flex items-center gap-3 mt-4 md:mt-0">
				<label className="text-sm text-zinc-200">Daily Target</label>
				<input
					type="number"
					min={1}
					value={temp}
					defaultValue={20}
					onChange={(e) => setTemp(e.target.value)}
					onBlur={() => {
						const val = Number(temp || 0);
						if (!Number.isFinite(val) || val <= 0) return setTemp(String(dailyPoints));
						setDailyPoints(val);
					}}
					className="w-24 md:w-28 rounded-md border border-zinc-700 bg-zinc-900 text-center px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 ring-fuchsia-500"
				/>
			</div>
		</div>
	);
} 