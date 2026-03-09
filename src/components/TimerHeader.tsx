'use client';

import {useTimer} from '@/hooks/useTimer';
import {cn} from '@/lib/utils';
import {useEffect} from "react";

interface TimerHeaderProps {
	initialMinutes?: number;
	onExpiredChange?: (isExpired: boolean) => void;
}

export function TimerHeader({initialMinutes = 2, onExpiredChange}: TimerHeaderProps) {
	const {minutes, seconds, isWarning, isExpired} = useTimer(initialMinutes);

	useEffect(() => {
		onExpiredChange?.(isExpired);
	}, [isExpired, onExpiredChange]);

	const formatTime = (value: number): string => {
		return value.toString().padStart(2, '0');
	};

	return (
		<header className="header w-full bg-[#1a3d2e] pt-1 xl:pt-2 pb-3.5 overflow-hidden">
			<div className="container">
				<div
					className="header__timer-container max-w-7xl mx-auto flex flex-col items-center justify-center gap-1 xl:gap-2">
                    <span className="header__text text-white text-2xl font-semibold">
                        Успейте открыть пробную неделю
                    </span>
					<span
						className={cn(
							'header__timer text-center text-[40px]/[1] text-[#FFBB00] gilroy-bold transition-colors' +
							' duration-300',
							isWarning && !isExpired && 'text-red-500 animate-pulse',
							isExpired && 'text-gray-400',
							!isWarning && !isExpired && 'text-[#ff6b4a]'
						)}
					>
                        {isExpired ? '00:00' : `${formatTime(minutes)}:${formatTime(seconds)}`}
                    </span>
				</div>
			</div>
		</header>
	);
}
