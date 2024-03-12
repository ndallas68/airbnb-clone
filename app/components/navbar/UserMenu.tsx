'use client';
import { useCallback, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';

import Avatar from '../Avatar';
import MenuItem from './MenuItem';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRentModal from '@/app/hooks/useRentModal';

import { signOut } from 'next-auth/react';
import { SafeUser } from '@/app/types';
import NeumophismButton from '../NeumorphismButton';

interface UserMenuProps {
    currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        rentModal.onOpen();
    }, [currentUser, loginModal, rentModal]);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                {/* <div
                    onClick={onRent}
                    className="
                        hidden
                        md:block
                        text-sm
                        font-semibold
                        py-3
                        px-4
                        rounded-full
                        hover:bg-neutral-100
                        transition
                        cursor-pointer
                    "
                >
                    Rent your home
                </div> */}
                <NeumophismButton 
                    onClick={onRent}
                    label="List a property"
                />
                <div
                //     onClick={toggleOpen}
                //     className="
                //         p-4
                //         md:py-1
                //         md:px-2
                //         border-[1px]
                //         border-neutral-200
                //         flex
                //         flex-row
                //         items-center
                //         gap-3
                //         rounded-full
                //         cursor-pointer
                //         hover:shadow-md
                //         transition
                //     "
                        onClick={toggleOpen}
                        className="
                            px-4
                            py-2
                            rounded-full
                            flex
                            items-center
                            gap-2
                            text-slate-500
                            shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]

                            cursor-pointer
                            transition-all

                            hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
                            hover:text-rose-500
                        "
                 >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={currentUser?.image}/>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="
                        absolute
                        rounded-xl
                        shadow-md
                        w-[40vw]
                        md:w-3/4
                        bg-white
                        overflow-hidden
                        right-0
                        top-12
                        text-sm
                  "
                >
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                            <>
                                <MenuItem 
                                    onClick={() => {}}
                                    label="My Reviews"
                                />
                                <MenuItem
                                    onClick={registerModal.onOpen}
                                    label="My favorites"
                                />
                                <MenuItem 
                                    onClick={() => {}}
                                    label="My leases"
                                />
                                <MenuItem
                                    onClick={registerModal.onOpen}
                                    label="My properties" 
                                />
                                <MenuItem 
                                    onClick={rentModal.onOpen}
                                    label="List a space"
                                />
                                <hr />
                                <MenuItem 
                                    onClick={() => signOut()}
                                    label="Logout"
                                />
                            </>
                        ) : (
                            <>
                                <MenuItem 
                                    onClick={loginModal.onOpen}
                                    label="Login"
                                />
                                <MenuItem
                                    onClick={registerModal.onOpen}
                                    label="Sign Up"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;