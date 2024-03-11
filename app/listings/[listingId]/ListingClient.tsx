'use client';

import { Range } from "react-date-range";
import { toast } from "react-hot-toast";
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Lease } from "@prisma/client";
import { useRouter } from "next/navigation";

import { SafeLease, SafeListing, SafeUser } from "@/app/types";
import { categories } from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingLease from "@/app/components/listings/ListingLease";

import useLoginModal from "@/app/hooks/useLoginModal";


const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
};

interface ListingClientProps {
    leases?: SafeLease[];
    listing: SafeListing & {
        user: SafeUser;
    };
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    // always run iterations without getting errors (.map, .find, etc)
    leases = [],
    currentUser
}) => {
    const loginModal = useLoginModal();
    const router = useRouter();

    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        leases.forEach((lease) => {
            const range = eachDayOfInterval({
                start: new Date(lease.startDate),
                end: new Date(lease.endDate)
            });

            dates = [...dates, ...range];
        });

        return dates;
    },[leases]);

    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const onCreateLease = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        setIsLoading(true);

        axios.post('/api/leases', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
        .then(() => {
            toast.success('Listing reserved!');
            setDateRange(initialDateRange);
            // Redirect to /leases
            router.refresh();
        })
        .catch(() => {
            toast.error('Something went wrong');
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [
        currentUser, 
        loginModal, 
        dateRange, 
        listing?.id, 
        router, 
        totalPrice
    ]);

    // calculation of price per month
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const monthCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            );

            if (monthCount && listing.price) {
                setTotalPrice(monthCount * listing.price);
            } else {
                setTotalPrice(listing.price);
            }
        }
    }, [dateRange, listing.price]);

    const category = useMemo(() => {
        return categories.find((items) => 
        items.label === listing.category);
    }, [listing.category]);
    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-7
                        md:gap-10
                        mt-6
                    "
                    >
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.category}
                            roomCount={listing.roomCount}
                            bathroomCount={listing.bathroomCount}
                            renterCount={listing.renterCount}
                            locationValue={listing.locationValue}
                        />
                        <div
                            className="
                                order-first
                                mb-10
                                md:order-last
                                md:col-span-3
                            "
                        >
                            <ListingLease
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateLease}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default ListingClient;