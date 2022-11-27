// import supabase
import { toast } from "react-toastify";
import { supabase } from "../utils/supabase";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import Head from "next/head";

//userData as a prop session

export const ItemForm = ({ merchantId }: { merchantId: string }) => {
  const createItem = trpc.items.newItems.useMutation();
  const itemsByMerchant = trpc.items.merchantItems.useQuery({
    merchantId: merchantId,
  });

  return (
    <>
      <Head>
        <title>Merchant dashboard</title>
      </Head>
      <div>
        {itemsByMerchant.data?.map((item) => (
          <div key={item.id}>
            <p>{item.itemName}</p>
            <p>{item.price}</p>
            <p>{item.description}</p>
            <Image
              src={item.image as string}
              width={100}
              height={100}
              className="rounded-full"
              alt="User avatar"
            />
          </div>
        ))}

        <div className="space-y-6 ">
          <div className=" px-4 py-5 shadow sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  New Item
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This Item will be displayed and sold on our website,
                  <br></br>
                  make sure you agree to our terms and conditions.
                </p>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <form
                  className="space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const target = e.target as typeof e.target & {
                      itemName: { value: string };
                      description: { value: string };
                      price: { value: string };
                      quantity: { value: string };
                      itemImage: { files: FileList };
                    };
                    const itemName = target.itemName.value;
                    const description = target.description.value;
                    const price = target.price.value;
                    const quantity = target.quantity.value;
                    const itemImage = target.itemImage.files[0] as File;

                    const { data, error } = await supabase.storage
                      .from("item-image")
                      .upload(itemName, itemImage);

                    if (error) {
                      toast.error(error.message);
                    }

                    const itemImageUrl = supabase.storage
                      .from("item-image")
                      .getPublicUrl(itemName);

                    const imageUrl = itemImageUrl.data.publicUrl;
                    //parse price to int

                    createItem.mutateAsync(
                      {
                        name: itemName,
                        description,
                        price: parseInt(price),
                        quantity: parseInt(quantity),
                        image: imageUrl,
                        merchantId,
                      },
                      {
                        onSuccess: () => {
                          toast.success("Item created");
                        },
                        onError: (error) => {
                          toast.error(error.message);
                        },
                      }
                    );
                  }}
                >
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="itemName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Item Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="itemName"
                          id="itemName"
                          className="block w-full flex-1  rounded-md border-gray-300 focus:border-primary focus:ring-primary  sm:text-sm"
                          placeholder="Painting of van Gogh"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary  sm:text-sm"
                        placeholder="Made in Africa by ..."
                        defaultValue={""}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your item, that will be auction on
                      our website.
                    </p>
                  </div>

                  <div>
                    <div className="mt-1 flex items-center space-x-5">
                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          min={0}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantity
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          id="quantity"
                          min={0}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary  sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image item
                    </label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="itemImage"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="itemImage"
                              name="itemImage"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
