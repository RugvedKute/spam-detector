export default function InputField({
  labelName,
  type,
  placeholder,
  field,
  value,
  setData,
  required,
}) {
  const handleChange = (e) => {
    const { value } = e.target;
    setData(field, value);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold">{labelName}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        className="mt-1 border-2 border-slate-200 rounded-md px-2 py-1 outline-none text-sm"
        onChange={handleChange}
        required={required}
      />
    </div>
  );
}
