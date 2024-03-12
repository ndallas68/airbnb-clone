import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getLeases(
    params: IParams
) {
    try {
        const { listingId, userId, authorId } = params;

        const query: any = {};

        if (listingId) {
            query.listingId = listingId;
        }

        if (userId) {
            query.userId = userId;
        }

        if (authorId) {
            query.listing = { userId: authorId }
        }

        const leases = await prisma.lease.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeLeases = leases.map(
            (lease) => ({
                ...lease,
                createdAt: lease.createdAt.toISOString(),
                startDate: lease.startDate.toISOString(),
                endDate: lease.endDate.toISOString(),
                listing: {
                    ...lease.listing,
                    createdAt: lease.listing.createdAt.toISOString()
                }
            })
        );

        return safeLeases;
    } catch (error: any) {
        throw new Error(error);
    }
}