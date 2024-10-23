import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="text-black py-4">
      <div className="container mx-auto text-center">
        <a
          href="https://github.com/xditya/project-survey"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center space-x-2 hover:underline"
        >
          {/* Octocat Logo */}
          <GitHubLogoIcon className="w-5 h-5" />
          <span className=" text-blue-400">GitHub</span>
        </a>
      </div>
    </footer>
  );
}
