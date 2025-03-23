import React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { NavArrowUp, NavArrowDown } from "iconoir-react";
import { User } from "../../structures/model";
interface UserDropdownProps {
  selectedUser: User | null;
  onUserChange: (user: User | null) => void;
  users: User[];
  isLoadingUsers: boolean;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  selectedUser,
  onUserChange,
  users,
  isLoadingUsers,
}) => {
  return (
    <div className="relative" onClick={(e) => e.preventDefault()}>
      {isLoadingUsers ? (
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
      ) : (
        <Listbox value={selectedUser} onChange={onUserChange}>
          {({ open }) => (
            <div className="relative">
              <Listbox.Button className="relative w-full p-3 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 hover:bg-opacity-100 transform hover:scale-[1.02] transition-all duration-200">
                <span className="block truncate text-gray-600">
                  {selectedUser?.username || "Select User"}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {open ? (
                    <NavArrowUp className="w-5 h-5 text-violet-500" />
                  ) : (
                    <NavArrowDown className="w-5 h-5 text-violet-500" />
                  )}
                </span>
              </Listbox.Button>
              <Transition
                as={React.Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white bg-opacity-90 backdrop-blur-sm shadow-lg border border-gray-200 py-1">
                  {users.map((user) => (
                    <Listbox.Option
                      key={user.id}
                      value={user}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 px-4 ${
                          active
                            ? "bg-violet-100 text-violet-900"
                            : "text-gray-600"
                        }`
                      }
                    >
                      {user.username}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      )}
    </div>
  );
};