import Logo from "../assets/logo.png";


const authLayout = ({ children }) => {
  return (
    <div>
      <header className="flex justify-center items-center py-6 h-20 shadow-md bg-white">
        <a href="/email">
        <img src={Logo} alt="Logo" width={350} height={100} />
        </a>
      </header>

      {children}
    </div>
  );
};

export default authLayout;
