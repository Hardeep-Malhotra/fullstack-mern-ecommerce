const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-400 text-center py-4 border-t border-slate-800">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} WanderStore. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;