import { motion } from 'framer-motion';

export default function ProgressBar({ value, max }) {
	const pct = Math.min(100, Math.round((value / max) * 100 || 0));
	return (
		<div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
			<motion.div
				initial={{ width: 0 }}
				animate={{ width: `${pct}%` }}
				transition={{ duration: 0.5 }}
				className="h-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-400"
			/>
		</div>
	);
} 