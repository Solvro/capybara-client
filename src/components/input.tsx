interface InputProps {
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
  textColor?: string;
  bgColor?: string;
}

function Input({
  value,
  setValue,
  disabled,
  placeholder,
  textColor = "violet",
  bgColor = "white",
}: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`px-4 py-2 my-4 bg-${bgColor} text-${textColor}-950 rounded-2xl text-center w-2/3 text-sm ${
        disabled && "opacity-50 cursor-not-allowed"
      }`}
      placeholder={placeholder}
      disabled={disabled}
    ></input>
  );
}

export default Input;
