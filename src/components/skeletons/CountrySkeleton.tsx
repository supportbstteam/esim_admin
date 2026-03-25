export const CountryFormSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-2xl mt-8 animate-pulse">
      
      {/* header */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <div className="w-8 h-8 bg-gray-200 rounded" />
        <div className="h-6 w-48 bg-gray-200 rounded" />
      </div>

      <div className="space-y-6">
        {/* name */}
        <div>
          <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>

        {/* iso */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-24 bg-gray-200 mb-2 rounded" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>

          <div>
            <div className="h-4 w-28 bg-gray-200 mb-2 rounded" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* currency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded-lg" />
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>

        {/* description */}
        <div>
          <div className="h-4 w-32 bg-gray-200 mb-2 rounded" />
          <div className="h-24 bg-gray-200 rounded-lg" />
        </div>

        {/* image */}
        <div className="h-32 bg-gray-200 rounded-2xl" />

        {/* toggle */}
        <div className="h-6 w-32 bg-gray-200 rounded" />

        {/* seo */}
        <div className="space-y-4">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded-lg" />
          <div className="h-20 bg-gray-200 rounded-lg" />
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>

        {/* footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};