'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    selected,
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        // create an object out of all current parameters
        // as users click or search with filters, they will be added to the router/url so they won't be lost while navigating
        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        // when click on one of the categories, the label will become the category parent of the url
        // spread the currentQuery object and add the current category
        const updatedQuery: any = {
            ...currentQuery,
            category: label,
        }

        // check if we've already selected a category, if selected again, remove selection
        if (params?.get('category') == label) {
            delete updatedQuery.category;
        }

        // generate url with newest query and set path name without null (unselected) params [path always starts with "/"]
        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });
        
        router.push(url);
    // set dependancies
    }, [label, params, router]);

    return (
        <div
            onClick={handleClick}
            className={`
                flex
                flex-col
                items-center
                justify-center
                gap-2
                p-3
                border-b-2
                hover:text-neutral-800
                transition
                cursor-pointer
                ${selected ? 'border-b-neutral-800' : 'border-transparent'}
                ${selected ? 'text-neutral-800' : 'text-neutral-500'}
            `}
        >
        <Icon size={26} />
            <div className="font-medium text-sm">
                {label}
            </div>
        </div>
    );
}

export default CategoryBox;