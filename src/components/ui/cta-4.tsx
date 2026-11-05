import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Cta4Props {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonOnClick?: () => void;
  items?: string[];
}

const defaultItems = [
  "Easy Integration",
  "24/7 Support",
  "Customizable Design",
  "Scalable Performance",
  "Hundreds of Blocks",
];

export const Cta4 = ({
  title = "Call to Action",
  description = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto illo praesentium nisi, accusantium quae.",
  buttonText = "Get Started",
  buttonUrl = "#",
  buttonOnClick,
  items = defaultItems,
}: Cta4Props) => {
  return (
    <section className="py-6 sm:py-20 md:py-28 px-3.5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-start justify-between gap-4 sm:gap-8 rounded-xl sm:rounded-3xl bg-muted p-4 sm:p-10 lg:p-16 md:flex-row">
          <div className="w-full md:w-3/5 text-left">
            <h4 className="mb-1.5 text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-balance">{title}</h4>
            <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">{description}</p>
            <div className="mt-3.5 sm:mt-8">
              {buttonOnClick ? (
                <Button 
                  type="button"
                  className="w-full sm:w-auto min-h-[40px] sm:min-h-[44px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center cursor-pointer" 
                  onClick={buttonOnClick}
                >
                  <span className="flex items-center justify-center">
                    {buttonText} <ArrowRight className="ml-2 size-3.5 sm:size-4" />
                  </span>
                </Button>
              ) : (
                <Button 
                  className="w-full sm:w-auto min-h-[40px] sm:min-h-[44px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center cursor-pointer" 
                  asChild
                >
                  <a href={buttonUrl} className="flex items-center justify-center">
                    {buttonText} <ArrowRight className="ml-2 size-3.5 sm:size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="w-full md:w-2/5 md:pl-6 border-t md:border-t-0 md:border-l border-border/60 pt-3.5 md:pt-0">
            <ul className="flex flex-col space-y-2 sm:space-y-3 text-xs sm:text-sm font-medium">
              {items.map((item, idx) => (
                <li className="flex items-center text-foreground/90" key={idx}>
                  <Check className="mr-2.5 sm:mr-3 size-3.5 sm:size-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
