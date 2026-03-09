import {useCallback, useEffect, useMemo, useState} from "react";
import {Loader2} from "lucide-react";
import {useTariffs} from "@/hooks/useTariffs";
import {cn} from "@/lib/utils";
import {TariffCard} from "@/components/TariffCard";

interface TariffSectionProps {
	isTimerExpired: boolean;
}

const TARIFF_ORDER: Record<string, number> = {
	"Навсегда": 1,
	"3 месяца": 2,
	"1 месяц": 3,
	"1 неделя": 4,
};

export function TariffSection({isTimerExpired}: TariffSectionProps) {
	const {tariffs, loading, error} = useTariffs();
	const [selectedUniqueId, setSelectedUniqueId] = useState<string | null>(null);
	const [isAgreed, setIsAgreed] = useState(false);
	const [showCheckboxError, setShowCheckboxError] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

	// Мемоизированная сортировка с созданием уникальных ID
	const sortedTariffs = useMemo(() => {
		return [...tariffs]
		.sort((a, b) => {
			if (a.is_best && !b.is_best) return -1;
			if (!a.is_best && b.is_best) return 1;
			const orderA = TARIFF_ORDER[a.period] || 999;
			const orderB = TARIFF_ORDER[b.period] || 999;
			return orderA - orderB;
		})
		.map((tariff, index) => ({
			...tariff,
			uniqueId: `${tariff.id}-${index}`, // Уникальный ID для выбора
			originalIndex: index,
		}));
	}, [tariffs]);

	// Устанавливаем начальный выбранный тариф только при первой загрузке
	useEffect(() => {
		if (sortedTariffs.length > 0 && selectedUniqueId === null) {
			const bestTariff = sortedTariffs.find((tariff) => tariff.is_best);
			if (bestTariff) {
				setSelectedUniqueId(bestTariff.uniqueId);
			} else {
				setSelectedUniqueId(sortedTariffs[0]?.uniqueId || null);
			}
		}
	}, [sortedTariffs, selectedUniqueId]);

	// Стабильный обработчик изменения
	const handleTariffChange = useCallback((uniqueId: string) => {
		setSelectedUniqueId(uniqueId);
	}, []);

	const handleBuyClick = (period: string) => {
		if (!isAgreed) {
			setShowCheckboxError(true);
			setTimeout(() => setShowCheckboxError(false), 800);
			return;
		}

		setSelectedPeriod(period);
		setIsModalOpen(true);
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsAgreed(e.target.checked);
		if (e.target.checked) {
			setShowCheckboxError(false);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-10 h-10 text-[#ff6b4a] animate-spin"/>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-red-500">Ошибка загрузки: {error}</p>
			</div>
		);
	}

	return (
		<section className="tariff py-5 xl:py-[54px]">
			<h1 className="tariff__title text-[40px]/[1] font-medium xl:font-bold text-white tracking-[3%] xl:tracking-[1%]">
				Выбери подходящий для&nbsp;себя <span className="text-[#FDB056]">тариф</span>
			</h1>

			<form
				className="grid xl:grid-cols-[minmax(125px,_380px)_1fr] xl:gap-[90px] items-start mb-[20px] xl:mb-[66px]">
				<div className="tariff__image relative max-w-[130px] xl:max-w-[380px] m-auto mb-[-11px] xl:mb-auto">
					<img
						src="/images/img.png"
						alt="Athlete"
						className="w-full h-auto object-contain"
					/>
				</div>

				<div>
					<div
						className="tariff__card flex flex-wrap gap-2 xl:gap-[12px_14px] items-stretch mb-[12px] xl:mb-[20px]">
						{sortedTariffs.map((tariff) => (
							<TariffCard
								key={tariff.uniqueId}
								tariff={tariff}
								isSelected={selectedUniqueId === tariff.uniqueId}
								isBest={tariff.is_best}
								isTimerExpired={isTimerExpired}
								uniqueId={tariff.uniqueId}
								onChange={() => handleTariffChange(tariff.uniqueId)}
							/>
						))}
					</div>
					<p className="tariff__warning relative bg-[#2D3233] rounded-[20px] max-w-[499px] text-white text-[12px]/[1.3] xl:text-[16px]/[1.3] m-0 pt-[14px] pb-[16px] pl-[40px] xl:py-[18px] xl:pl-[51px] pr-[15px] mb-6  xl:mb-[30px]">
						Следуя плану на 3 месяца и более, люди получают в 2 раза лучший результат,
						чем&nbsp;за&nbsp;1&nbsp;месяц
					</p>

					<div className="mt-4">
						<label
							className={cn(
								"flex items-start gap-3 cursor-pointer group transition-all duration-200",
								showCheckboxError && "animate-shake"
							)}
						>
							<div className="relative flex-shrink-0">
								<input
									type="checkbox"
									checked={isAgreed}
									onChange={handleCheckboxChange}
									className={cn(
										"w-[30px] h-[30px] xl:w-8 xl:h-8 rounded border-2 appearance-none" +
										" cursor-pointer" +
										" transition-all" +
										" duration-200 bg-transparent group-hover:border-[#FDB056]",
										isAgreed
											? "border-[#606566]"
											: showCheckboxError
												? "border-[#FDB056]"
												: "border-gray-600 "
									)}
								/>
								{isAgreed && (
									<svg
										className="absolute top-0 left-1/2 -translate-x-1/2  w-7 h-7 text-[#FDB056] pointer-events-none"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={3}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								)}
							</div>
							<span
								className={cn(
									"text-[12px]/[1.1] xl:text-[16px]/[1] text-[#CDCDCD] transition-colors" +
									" duration-200" +
									" max-w-[600px]",
									showCheckboxError ? "text-red-400" : "text-gray-400"
								)}
							>
								Я согласен с{" "}
								<a href="#" className="underline hover:text-white">
									офертой рекуррентных платежей
								</a>
								,{" "}
								и{" "}
								<a href="#" className="underline hover:text-white">
									Политикой конфиденциальности
								</a>
							</span>
						</label>
					</div>

					<button
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							const selectedTariff = sortedTariffs.find(t => t.uniqueId === selectedUniqueId);
							if (selectedTariff) handleBuyClick(selectedTariff.period);
						}}
						className={cn(
							"tariff__submit mt-3 mb-[20px] xl:mb-3.5 w-full max-w-[352px] py-[18px] px-5" +
							" rounded-[20px] font-bold" +
							" text-black" +
							" text-[20px]",
							"bg-[#ff9f43] hover:bg-[#ffaa5c]",
							"transition-all duration-200"
						)}
					>
						Купить
					</button>

					<p className="text-[#9B9B9B] text-[10px]/[1.2] xl:text-[14px]/[1.2]">
						Нажимая кнопку «Купить», Пользователь соглашается на разовое списание денежных средств для
						получения пожизненного доступа к приложению. Пользователь соглашается, что данные
						кредитной/дебетовой карты будут сохранены для осуществления покупок дополнительных услуг сервиса
						в случае желания пользователя.
					</p>
				</div>
			</form>

			<div className="border border-[#484D4E] rounded-[30px] p-3 xl:p-5">
					<span
						className="tariff__garanty-title inline-block py-[8px] px-[17px] xl:px-[30px] xl:py-2.5 border border-[#81FE95] bg-[#2D3233] text-[#81FE95] text-[18px] xl:text-[28px] font-medium rounded-[30px] mb-2.5 xl:mb-[34px]">
						гарантия возврата 30 дней
					</span>
				<p className="tariff__garanty-text text-[#DCDCDC] text-[14px]/[1.3] xl:text-[24px]/[1.3]">
					Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже через 4 недели! Мы
					даже готовы полностью вернуть твои деньги в течение 30 дней с момента покупки, если ты не получишь
					видимых результатов.
				</p>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
					<div className="bg-white p-8 rounded-lg text-center">
						<h3 className="text-2xl font-bold mb-4 text-gray-900">
							Вы приобрели тариф: {selectedPeriod}
						</h3>
						<button
							onClick={closeModal}
							className="mt-4 py-2 px-6 bg-[#ff6b4a] text-white rounded-lg"
						>
							Закрыть
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
