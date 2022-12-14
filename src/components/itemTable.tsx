import React, { use, useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notify from "./notification";

const ItemTable = ({ merchantId }: { merchantId: string }) => {
  const [show, setShow] = useState(false);
  const {
    data: items,
    isError,
    isLoading,
    refetch,
  } = trpc.items.lastBidAmount.useQuery({
    merchantId,
  });

  const { data: soldItems } = trpc.items.soldItems.useQuery({
    merchantId,
  });

  const deleteItem = trpc.items.delete.useMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className="mb-8 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Item Name
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Inital Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Last Bid Ammount
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items?.map((item, itemidx) => (
                    <tr
                      key={item.id}
                      className={itemidx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {item.itemName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {item.price}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {item.bidders[0]?.bidAmount
                          ? item.bidders[0]?.bidAmount
                          : item.price}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {/* if status is availbale make green backgorund badge */}
                        {item.status === "AVAILABLE" ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            {item.status}
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex flex-row gap-2">
                          {/* if item is sold dont show delete and close deal button  */}
                          <button
                            type="button"
                            onClick={async () => {
                              deleteItem.mutate(
                                //piratun can be deleted, already linked to merchant
                                { id: item.id },
                                {
                                  onSuccess: () => {
                                    refetch();
                                  },
                                  onError: (err) => {
                                    toast.error(
                                      "Item could not be deleted or item is already bid"
                                    );
                                  },
                                }
                              );
                            }}
                            className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Close Deal
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Item Name
                    </th>
                    {/* <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    New Price
                  </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Inital Price
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {soldItems?.map((item, itemidx) => (
                    <tr
                      key={item.id}
                      className={itemidx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {item.itemName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {item.price}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex flex-row gap-2">
                          {/* if item is sold dont show delete and close deal button  */}
                          Item sold
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
      {/* close notify after 3 secs */}
    </>
  );
};

export default ItemTable;
