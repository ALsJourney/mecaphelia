"use client";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "./ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();

  const handlerSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // const value = event.target.value;
      // const params = new URLSearchParams(searchParams);

      // if (value) {
      //   params.set("search", value);
      // } else {
      //   params.delete("search");
      // }

      // // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // replace(`${pathname}?${params.toString()}` as any, {
      //   scroll: false,
      // });
      //
      onChange(event.target.value);
    },
    250,
  );

  return (
    <Input
      defaultValue={value}
      placeholder={placeholder}
      onChange={handlerSearch}
    />
  );
};

export { SearchInput };
