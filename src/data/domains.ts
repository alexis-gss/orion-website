export type DomainId = "cinema" | "games" | "books";

export type DomainScreen = {
  key: string;
  src: string;
  label: string;
  description: string;
};

export type Domain = {
  id: DomainId;
  /** Short label used in tabs/nav. */
  label: string;
  /** The few words highlighted with the domain's accent color in the Hero title. */
  heroHighlight: string;
  /** Rest of the Hero title, right after `heroHighlight`. */
  heroTitleEnd: string;
  /** Hero paragraph, tailored to this domain's content and data source. */
  heroDescription: string;
  /** Data source credited in the footer. */
  source: { name: string; url: string };
  screens: DomainScreen[];
};

export const domains: Domain[] = [
  {
    id: "cinema",
    label: "Movies & TV",
    heroHighlight: "Your movies and shows",
    heroTitleEnd: "in one place.",
    heroDescription:
      "Orion is a native Android app to manage your library, discover new movies and shows, save your favorites and track your progress, with TMDB as its data source.",
    source: { name: "TMDB", url: "https://www.themoviedb.org/" },
    screens: [
      {
        key: "planning",
        src: "/assets/cinema/planning.webp",
        label: "Planning",
        description:
          "Upcoming releases of followed movies and TV shows, organized day by day.",
      },
      {
        key: "bookmark",
        src: "/assets/cinema/bookmark.webp",
        label: "Bookmark",
        description:
          "List of followed movies and TV shows, with an overview of the number of episodes left.",
      },
      {
        key: "search",
        src: "/assets/cinema/search.webp",
        label: "Search",
        description:
          "Filterable search, along with a list of what's currently popular.",
      },
      {
        key: "account",
        src: "/assets/cinema/account.webp",
        label: "Account",
        description:
          "Favorites and watched movies and TV shows, preceded by a brief overview of the statistics.",
      },
      {
        key: "statistics",
        src: "/assets/cinema/statistics.webp",
        label: "Statistics",
        description:
          "Total, monthly average, best month, favorite genres, etc.",
      },
      {
        key: "details",
        src: "/assets/cinema/details.webp",
        label: "Details",
        description:
          "Available information about a movie or TV show: synopsis, cast, budget, etc…",
      },
    ],
  },
  {
    id: "games",
    label: "Video Games",
    heroHighlight: "Your video games",
    heroTitleEnd: "in one place.",
    heroDescription:
      "Orion is a native Android app to manage your library, discover new games, save your favorites and track your progress, with IGDB as its data source.",
    source: { name: "IGDB", url: "https://www.igdb.com/" },
    screens: [
      {
        key: "planning",
        src: "/assets/games/planning.webp",
        label: "Planning",
        description:
          "Upcoming releases of followed games, organized day by day.",
      },
      {
        key: "bookmark",
        src: "/assets/games/bookmark.webp",
        label: "Bookmark",
        description:
          "Followed, completed or in-progress games, with playtime and progress.",
      },
      {
        key: "search",
        src: "/assets/games/search.webp",
        label: "Search",
        description:
          "Filterable search, along with a list of games that are currently popular.",
      },
      {
        key: "account",
        src: "/assets/games/account.webp",
        label: "Account",
        description:
          "Favorites and completed games, preceded by a quick overview of account statistics.",
      },
      {
        key: "statistics",
        src: "/assets/games/statistics.webp",
        label: "Statistics",
        description:
          "Total, monthly average, best month, favorite genres, etc.",
      },
      {
        key: "details",
        src: "/assets/games/details.webp",
        label: "Details",
        description:
          "Available information about a game: synopsis, platforms, DLC, related content, etc.",
      },
    ],
  },
  {
    id: "books",
    label: "Books",
    heroHighlight: "Your books",
    heroTitleEnd: "in one place.",
    heroDescription:
      "Orion is a native Android app to manage your library, discover new books, save your favorites and track your progress, with Hardcover as its data source.",
    source: { name: "Hardcover", url: "https://hardcover.app/" },
    screens: [
      {
        key: "planning",
        src: "/assets/books/planning.webp",
        label: "Planning",
        description:
          "Upcoming releases of followed books and volumes, organized day by day.",
      },
      {
        key: "bookmark",
        src: "/assets/books/bookmark.webp",
        label: "Bookmark",
        description:
          "Followed, read or in-progress books, with an overview of your reading progress.",
      },
      {
        key: "search",
        src: "/assets/books/search.webp",
        label: "Search",
        description:
          "Filterable search, along with a list of books that are currently popular.",
      },
      {
        key: "account",
        src: "/assets/books/account.webp",
        label: "Account",
        description:
          "Favorites and books you've read, preceded by a quick overview of account statistics.",
      },
      {
        key: "statistics",
        src: "/assets/books/statistics.webp",
        label: "Statistics",
        description:
          "Total, monthly average, best month, favorite genres, etc.",
      },
      {
        key: "details",
        src: "/assets/books/details.webp",
        label: "Details",
        description:
          "Available information about a book: synopsis, author, edition, etc.",
      },
    ],
  },
];
