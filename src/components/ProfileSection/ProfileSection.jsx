export default function ProfileSection() {
  return (
    <>
      <form>
        <div className="space-y-12">
          {/* Profile Section */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

              {/* Username */}
              <div className="sm:col-span-4 col-span-full">
                <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="block w-full border-none py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                      placeholder="janesmith"
                    />
                  </div>
                </div>
              </div>

              {/* Instagram ID */}
              <div className="sm:col-span-4 col-span-full">
                <label htmlFor="instaId" className="block text-sm font-medium text-gray-900">
                  Instagram ID
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="instaId"
                    id="instaId"
                    placeholder="@insta_username"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Photo */}
              <div className="col-span-full">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <svg className="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Z"
                    />
                  </svg>
                  <button
                    type="button"
                    className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Cover Photo */}
              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-900">
                  Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6Z"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Full Name */}
              <div className="sm:col-span-3 col-span-full">
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-900">
                  Full name
                </label>
                <input
                  type="text"
                  name="full-name"
                  id="full-name"
                  autoComplete="given-name"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-4 col-span-full">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* City */}
              <div className="sm:col-span-3 col-span-full">
                <label htmlFor="city" className="block text-sm font-medium text-gray-900">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
