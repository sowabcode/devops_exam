import clsx from "clsx";
import { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LayoutContext from "../contexts/LayoutContext";

import { BsFillGridFill, BsSearch } from "react-icons/bs";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { FaBookOpen, FaListUl, FaXmark } from "react-icons/fa6";

import m1 from "../assets/m1.jpeg";

const Livres = () => {
  const queryClient = useQueryClient();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [query, setQuery] = useState("");
  const [titre, setTitre] = useState("");
  const [annee, setAnnee] = useState("");
  const [auteur, setAuteur] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [quantite, setQuantite] = useState(0);
  const [categorie, setCategorie] = useState("");
  const [isbn, setIsbn] = useState("978-2-07-036024-5");
  const [success, setSuccess] = useState("");
  // const [error, setError] = useState("");

  const { showSidebar } = useContext(LayoutContext);

  const { data: allLivres } = useQuery({
    queryKey: ["livres"],
    queryFn: () => fetch(`${BASE_URL}/api/livres`).then((res) => res.json()),
  });

  const filteredLivres =
    query &&
    allLivres.filter(
      (livre) =>
        livre.titre.toLowerCase().includes(query.trim().toLowerCase()) ||
        livre.auteur.toLowerCase().includes(query.trim().toLowerCase()) ||
        livre.categorie.toLowerCase().includes(query.trim().toLowerCase()),
    );

  const livres = query.trim() !== "" ? filteredLivres : allLivres;

  const cleanData = () => {
    setTitre("");
    setAnnee("");
    setAuteur("");
    setOpen(false);
    setQuantite("");
    setCategorie("");
  };

  const addBook = useMutation({
    mutationFn: (postData) =>
      fetch(`${BASE_URL}/api/livres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }),
    onSuccess: (data) => {
      setSuccess("Livre ajouté avec succès.");
      cleanData();
      queryClient.invalidateQueries({ queryKey: ["livres"] });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      titre.trim() !== "" &&
      auteur.trim() !== "" &&
      categorie.trim() !== ""
    ) {
      const data = {
        isbn: isbn,
        titre: titre,
        auteur: auteur,
        categorie: categorie,
        annee: annee,
        quantite: quantite,
      };

      addBook.mutate(data);
    }
  };

  return (
    <main className={`${!showSidebar ? "main" : "main-full"} bg-slate-100`}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-bold text-3xl">Bibliothèque &gt; Livres</h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-4 bg-[#014455] hover:bg-[#235766] text-white px-10 py-2 rounded-lg cursor-pointer"
        >
          <FaBookOpen size={22} />
          <span>Ajouter un livre</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-5">
        <div className="px-3 py-2 bg-white shadow-md rounded-lg border-l-4 border-[#014455] space-y-2">
          <h3 className="text-slate-400 text-lg">Total livres</h3>
          <p className="text-3xl">{livres?.length}</p>
        </div>
        {/* <div className="px-3 py-2 bg-gray-100 shadow-md rounded-lg border-l-4 border-blue-700 space-y-2">
          <h3 className="text-slate-400 text-lg">Disponibles</h3>
          <p className="text-3xl">250</p>
        </div>
        <div className="px-3 py-2 bg-gray-100 shadow-md rounded-lg border-l-4 border-blue-700 space-y-2">
          <h3 className="text-slate-400 text-lg">Empruntés</h3>
          <p className="text-3xl">45</p>
        </div>
        <div className="px-3 py-2 bg-gray-100 shadow-md rounded-lg border-l-4 border-blue-700 space-y-2">
          <h3 className="text-slate-400 text-lg">Perdus</h3>
          <p className="text-3xl">5</p>
        </div> */}
      </div>

      <div className="flex items-center gap-4 rounded-lg bg-white py-3 px-2 mt-6">
        <div className="relative flex-1 border border-slate-300 py-2 rounded-lg px-2">
          <input
            type="search"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un livre..."
            className="border-none outline-none w-full h-full"
          />
          <div
            // onClick={handleSeache}
            className="absolute right-1 top-1/2 -translate-y-1/2 grid place-items-center px-6 py-2 bg-[#235766] rounded-lg cursor-pointer"
          >
            <BsSearch size={18} className="text-white" />
          </div>
        </div>
        <input
          type="text"
          placeholder="ISBN"
          className="border border-slate-300 py-2 rounded-lg px-2"
        />
        <input
          type="text"
          placeholder="Catégorie"
          className="border border-slate-300 py-2 rounded-lg px-2"
        />

        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
          <div className="grid place-items-center p-1.5 bg-[#235766] text-white rounded-lg">
            <FaListUl size={22} />
          </div>
          <div className="grid place-items-center p-1">
            <BsFillGridFill size={22} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-10 mt-5">
        {livres && livres?.length > 0 ? (
          livres.map((livre) => (
            <div
              key={livre.id}
              className="relative group shadow-md rounded-lg bg-white flex flex-col items-center justify-center"
              // shadow-md rounded-lg bg-gray-100 flex flex-col overflow-hidden
            >
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button
                  // onClick={() => handleEdit(livre)}
                  className="p-1.5 rounded-md bg-white shadow text-blue-600 hover:bg-blue-50"
                >
                  <MdEdit size={18} />
                  {/* <PencilIcon className="w-4 h-4" /> */}
                </button>
                <button
                  // onClick={() => handleDelete(livre.id)}
                  className="p-1.5 rounded-md bg-white shadow text-red-500 hover:bg-red-50"
                >
                  <MdDeleteForever size={18} />
                  {/* <TrashIcon className="w-4 h-4" /> */}
                </button>
              </div>

              <div className="flex flex-col items-center justify-center px-4 py-6 mb-3">
                <img
                  src={m1}
                  alt="IMG_LIVRE"
                  className="w-20 h-24 bg-cover shadow-md"
                />

                <h1 className="text-center text-lg mt-4">{livre.titre}</h1>
                <p className="text-sm text-slate-400">{livre.auteur}</p>
                <p>{livre.annee}</p>
                <p>{livre.isbn}</p>
              </div>

              <div
                className={clsx(
                  "absolute bottom-0 w-full h-10  flex items-center justify-center rounded-bl-lg rounded-br-lg",
                  {
                    "bg-green-400 text-white": livre.statut === "Disponible",
                    "bg-red-400 text-white": livre.statut === "Emprunté",
                  },
                )}
              >
                {livre.statut}
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>Aucun livre à afficher.</p>
          </div>
        )}
      </div>

      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 inset-0 flex justify-center items-center bg-black/50"
          >
            <div className="w-[500px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] bg-white rounded-lg px-4 py-2">
              <div className="flex items-center justify-between gap-10 mb-10 border-b border-gray-200">
                <h1 className="text-lg font-semibold">AJOUT D'UN LIVRE</h1>
                <button
                  onClick={() => setOpen(false)}
                  className="cursor-pointer p-1 rounded-full hover:bg-red-50"
                >
                  <FaXmark size={28} />
                </button>
              </div>

              <form
                className="flex flex-col gap-3 w-full"
                onSubmit={handleSubmit}
              >
                <div className="flex-1">
                  <label htmlFor="nom" className="text-sm text-slate-500">
                    Titre *
                  </label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    placeholder="Titre de l'ouvrage"
                    className="p-2 rounded-lg border w-full border-gray-200"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="auteur" className="text-sm text-slate-500">
                    Auteur *
                  </label>
                  <input
                    type="text"
                    id="auteur"
                    name="auteur"
                    placeholder="Prénom et nom"
                    className="p-2 rounded-lg border border-gray-200 w-full"
                    value={auteur}
                    onChange={(e) => setAuteur(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex-1">
                    <label htmlFor="isbn" className="text-sm text-slate-500">
                      ISBN
                    </label>
                    <input
                      type="text"
                      id="isbn"
                      name="isbn"
                      placeholder="192-..."
                      className="p-2 rounded-lg border border-gray-200 w-full"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="annee" className="text-sm text-slate-500">
                      Année
                    </label>
                    <input
                      type="number"
                      id="annee"
                      name="annee"
                      placeholder="2026"
                      className="p-2 rounded-lg border border-gray-200 w-full"
                      value={annee}
                      onChange={(e) => setAnnee(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="categorie"
                      className="text-sm text-slate-500"
                    >
                      Catégorie
                    </label>
                    <input
                      type="text"
                      id="categorie"
                      name="categorie"
                      placeholder="192-..."
                      className="p-2 rounded-lg border border-gray-200 w-full"
                      value={categorie}
                      onChange={(e) => setCategorie(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="quantite"
                      className="text-sm text-slate-500"
                    >
                      Quantite
                    </label>
                    <input
                      type="number"
                      id="quantite"
                      name="quantite"
                      placeholder="2026"
                      className="p-2 rounded-lg border border-gray-200 w-full"
                      value={quantite}
                      onChange={(e) => setQuantite(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end mb-3">
                  <button
                    type="submit"
                    className="rounded-sm px-8 py-2 text-sm font-semibold active:scale-95 cursor-pointer transition-colors bg-[#014455] text-white hover:bg-[#235766]"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
};

export default Livres;
