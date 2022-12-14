import Image from "next/image";
import { trpc } from "../utils/trpc";

export default function AvailableItem() {
  const { data: items } = trpc.items.getAll.useQuery();

  return (
    <div className="">
      <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Trending items
          </h2>
        </div>

        <div className="relative mt-8">
          <div className="relative -mb-6 w-full overflow-x-auto pb-6">
            <ul
              role="list"
              className="mx-4 space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0"
            >
              {items?.map((product) => (
                <li
                  key={product.id}
                  className="w-64 flex-col text-center lg:w-auto"
                >
                  <div className="group relative">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <Image
                        src={product.image || ""}
                        alt={product.itemName || ""}
                        width={150}
                        height={150}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <div className="mt-6">
                      {/* <p className="text-sm text-gray-500">{product.color}</p> */}
                      <h3 className="mt-1 font-semibold text-gray-900"></h3>
                      <p className="mt-1 text-gray-900">${product.price}</p>
                    </div>
                  </div>

                  <h4 className="sr-only">Available colors</h4>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
