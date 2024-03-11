'use client';

import { Listing } from "@prisma/client";
import { Lease } from "@prisma/client";

import { SafeListing, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import useCountries from "@/app/hooks/useCountries";
import Image from "next/image";

import { useCallback, useMemo } from "react";
import { format } from 'date-fns';
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
    data: SafeListing;
    lease?: Lease;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
};

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    lease,
    onAction,
    disabled,
    actionLabel,
    actionId = '',
    currentUser
}) => {
    const router = useRouter();
    // extract getByValue from useCountries hook
    const { getByValue } = useCountries();

    const location = getByValue(data.locationValue);

    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }

            onAction?.(actionId);
        }, [disabled, onAction, actionId]
    )

    const price = useMemo(() => {
        if (lease) {
            return lease.totalPrice;
        }

        return data.price;
    }, [lease, data.price]);

    const leaseDate = useMemo(() => {
        if (!lease) {
            return null;
        }

        const start = new Date(lease.startDate);
        const end = new Date(lease.endDate);

        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [lease])


    return (
        <div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="
                col-span-1 cursor-point group
            "
        >
            <div className="flex flex-col gap-2 w-full">
                <div
                    className="
                        aspect-square
                        w-full
                        relative
                        overflow-hidden
                        rounded-xl
                    "
                >
                    <Image
                        fill
                        alt="Listing"
                        src={data.imageSrc}
                        className="
                            object-cover
                            h-full
                            w-full
                            cursor-pointer
                            group-hover:scale-110
                            transition
                        "
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500">
                    {leaseDate || data.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        $ {price}
                    </div>
                    {!lease && (
                        <div className="font-light">per year</div>
                    )}
                </div>
                {onAction && actionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}
            </div>
        </div>
    );
}

export default ListingCard;