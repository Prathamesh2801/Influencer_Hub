import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { faqs } from "../../../public/faqConfig";

export default function FaqSection() {
  return (
    <div className="bg-[#FFF1F7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#E4007C]">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-[#F06292] max-w-3xl mx-auto">
              Find answers to common questions about the creator flow, video submissions, and more
            </p>
          </div>

          <dl className="mt-10 sm:mt-16 space-y-6 divide-y divide-[#FACCE0]">
            {faqs.map((faq) => (
              <Disclosure
                key={faq.question}
                as="div"
                className="pt-6 first:pt-0"
              >
                {({ open }) => (
                  <>
                    <dt>
                      <DisclosureButton className="group flex w-full items-start justify-between text-left">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon
                              className="h-6 w-6 text-[#E4007C]"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="h-6 w-6 text-[#E4007C]"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </DisclosureButton>
                    </dt>
                    <DisclosurePanel as="dd" className="mt-3 pr-0 sm:pr-12">
                      <p className="text-base text-gray-600">{faq.answer}</p>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
