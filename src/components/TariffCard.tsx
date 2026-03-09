import {cn} from "@/lib/utils";
import {TariffWithDiscount} from "@/types/tariff";

// Расширенный интерфейс с uniqueId
interface TariffCardProps {
	tariff: TariffWithDiscount & { uniqueId: string };
	isSelected: boolean;
	isBest: boolean;
	isTimerExpired: boolean;
	uniqueId: string;
	onChange: () => void;
}

export function TariffCard({
	                           tariff,
	                           isSelected,
	                           isBest,
	                           isTimerExpired,
	                           uniqueId,
	                           onChange,
                           }: TariffCardProps) {

	return (
		<label
			htmlFor={uniqueId}
			className={cn(
				"tariff-card relative cursor-pointer rounded-[20px] xl:rounded-[34px] border-2 transition-all" +
				" duration-300 overflow-hidden  flex items-center text-white w-full xl:size-[calc(100%/3-14px)]" +
				" xl:h-auto flex-grow flex-shrink bg-[#313637] pt-[22px] pb-[17px]  xl:pt-[30px] xl:pb-[27px]" +
				" px-[28px]" +
				" xl:px-[16px]",
				isSelected ? "border-[#FDB056]" : "border-[#484D4E] hover:border-white",
				isBest && "is-best xl:w-full xl:pl-[120px]",
				isTimerExpired && "xl:px-[20px]",
				!isBest && "xl:flex-col pt-4 xl:pt-[65px]",
				isTimerExpired && isBest && "justify-center"
			)}
		>
			<input
				type="radio"
				id={uniqueId}
				name="selectedTariff"
				checked={isSelected}
				onChange={onChange}
				className="hidden"
			/>

			{/* Скидка - скрывается при isTimerExpired */}
			<div
				className={cn(
					"tariff-card__label tariff-card__discount absolute top-0 right-[28px] xl:right-auto xl:left-[49px]" +
					" xl:py-[3px] px-[6px] xl:px-[7px]",
					"bg-[#FD5656] text-white text-[22px] font-medium rounded-b-[8px]",
					"transition-all duration-500",
					(tariff.discountPercent === 0 || isTimerExpired) && "opacity-0 -translate-y-full",
					isBest && "right-[60px] xl:right-auto"
				)}
			>
				-{tariff.discountPercent}%
			</div>

			{/* Хит - скрывается при isTimerExpired */}
			{isBest && (
				<div
					className={cn(
						"tariff-card__label tariff-card__hit absolute text-[22px] text-[#FDB056]",
						"tracking-[3%] py-[3px] px-[7px] xl:font-bold top-0 xl:top-[5px] right-[6px] xl:right-[12px]",
						isTimerExpired && "opacity-0"
					)}
				>
					хит!
				</div>
			)}

			<div
				className={cn("w-full grid grid-cols-[1fr,_111px] items-center xl:block", isBest && "grid xl:grid" +
					" grid-cols-[auto,_1fr] gap-8 xl:gap-9 min-w-52")}>
				<div className={cn("xl:text-center")}>
					<span
						className={cn(
							"tariff-card__period text-[26px] font-medium block mb-3 xl:mb-[27px]",
							!isBest && "xl:mb-27px",
							isBest && "mb-3 xl:mb-[15px]"
						)}
					>
						{tariff.period}
					</span>

					<div className={cn("flex flex-col gap-[5px] flex-wrap w-fit xl:m-auto",
						!isBest && "xl:mb-[45px]")}>
						{/* Цена: при isTimerExpired показываем full_price */}
						<span
							className={cn(
								"tariff-card__price text-[50px]/[1] xl:font-semibold transition-all duration-500",
								isSelected ? "text-[#FDB056]" : ""
							)}
						>
						{isTimerExpired ? tariff.full_price : tariff.price} ₽
					</span>

						{/* Старая цена: скрывается при isTimerExpired */}
						<s
							className={cn(
								"tariff-card__del-price text-gray-500 transition-all duration-500 text-right" +
								" text-[24px]/[1]",
								(isTimerExpired || tariff.full_price <= tariff.price) && "hidden"
							)}
						>
							{tariff.full_price} ₽
						</s>
					</div>
				</div>
				<span
					className={cn(
						"text-white text-[14px] xl:text-[16px] text-left",
					)}
				>
					{tariff.text}
				</span>
			</div>
		</label>
	);
}
