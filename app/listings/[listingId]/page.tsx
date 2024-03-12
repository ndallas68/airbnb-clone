import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/navbar/EmptyState";
import ListingClient from "./ListingClient";
import getLeases from "@/app/actions/getLeases";

interface IParams {
    listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
    const listing = await getListingById(params);
    const leases = await getLeases(params);
    const currentUser = await getCurrentUser();

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <ListingClient 
                listing={listing}
                leases={leases}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
}

export default ListingPage;