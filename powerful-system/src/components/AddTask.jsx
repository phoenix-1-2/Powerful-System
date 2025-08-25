import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function AddTask({ onAdd, date, groupSuggestions = [] }) {
	const [title, setTitle] = useState('');
	const [points, setPoints] = useState('');
	const [group, setGroup] = useState('');
	const canAdd = title.trim().length > 0 && Number(points) > 0;

	return (
		<div className="rounded-xl border border-zinc-800 p-4 flex flex-col gap-2 bg-zinc-950 w-full">
			<div className="flex flex-col md:flex-row gap-2 w-full">
				<input
					placeholder="Task title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="flex-1 min-w-[150px] rounded-md border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-base focus:outline-none focus:ring-2 ring-fuchsia-500"
					/>
				<input
					placeholder="Subject (optional)"
					value={group}
					onChange={(e) => setGroup(e.target.value)}
					list="group-suggestions"
					className="flex-1 min-w-[120px] rounded-md border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-base focus:outline-none focus:ring-2 ring-fuchsia-500"
					/>
				<datalist id="group-suggestions">
					{groupSuggestions.map((g) => (
						<option key={g} value={g} />
					))}
				</datalist>
				<input
					type="number"
					min={1}
					placeholder="Points"
					value={points}
					onChange={(e) => setPoints(e.target.value)}
					className="w-20 rounded-md border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-base focus:outline-none focus:ring-2 ring-fuchsia-500"
					/>
				<motion.button
					whileHover={{ scale: canAdd ? 1.03 : 1 }}
					whileTap={{ scale: 0.97 }}
					onClick={() => {
						if (!canAdd) return;
						onAdd({ title: title.trim(), points: Number(points), date, group: group.trim() || undefined });
						setTitle('');
						setPoints('');
						setGroup('');
					}}
					className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
						canAdd ? 'bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 text-white hover:opacity-95' : 'bg-zinc-800 text-zinc-500'
					}`}
				>
					<Plus size={16} /> Add Task
				</motion.button>
			</div>
		</div>
	);
} 