'use client';

import {useCallback, useState} from 'react';
import {TariffSection} from '@/components/TariffSection';
import {TimerHeader} from '@/components/TimerHeader';

export default function HomePage() {
	const [isTimerExpired, setIsTimerExpired] = useState(false);

	const handleExpiredChange = useCallback((expired: boolean) => {
		setIsTimerExpired(expired);
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			<TimerHeader initialMinutes={2} onExpiredChange={handleExpiredChange}/>

			<main className={"flex-grow"}>
				<div className="container">
					<TariffSection isTimerExpired={isTimerExpired}/>
				</div>
			</main>

			<footer className={"border-t border-[#1a3d2e] py-3 text-gray-400 text-center"}>
				<div className="container">
					2026
				</div>
			</footer>
		</div>
	);
}
