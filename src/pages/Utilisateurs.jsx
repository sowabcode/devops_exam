import { useContext, useState } from "react";
import LayoutContext from "../contexts/LayoutContext";
import { FaUserPlus, FaXmark } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

import profile from "../assets/images.jpeg";
import { MdDeleteForever } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsSearch } from "react-icons/bs";

const types = [
  { id: "enseignant", nom: "Enseignant" },
  { id: "etudiant", nom: "Etudiant" },
  { id: "personnel", nom: "Personnel" },
];
const Utilisateurs = () => {
  const queryClient = useQueryClient();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [nom, setNom] = useState("");
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [success, setSuccess] = useState("");

  const { showSidebar } = useContext(LayoutContext);

  const { data: allUsers } = useQuery({
    queryKey: ["utilisateurs"],
    queryFn: () =>
      fetch(`${BASE_URL}/api/utilisateurs`).then((res) => res.json()),
  });

  const filteredUsers =
    query &&
    allUsers.filter(
      (livre) =>
        livre.nom.toLowerCase().includes(query.trim().toLowerCase()) ||
        livre.prenom.toLowerCase().includes(query.trim().toLowerCase()) ||
        livre.email.toLowerCase().includes(query.trim().toLowerCase()),
    );

  const utilisateurs = query.trim() !== "" ? filteredUsers : allUsers;

  const cleanData = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setOpen(false);
    setType("");
  };

  const addUser = useMutation({
    mutationFn: (postData) =>
      fetch(`${BASE_URL}/api/utilisateurs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }),
    onSuccess: (data) => {
      setSuccess("Utilisateur ajouté avec succès.");
      cleanData();
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      nom.trim() !== "" &&
      prenom.trim() !== "" &&
      type.trim() !== "" &&
      email.trim() !== ""
    ) {
      const data = {
        nom: nom,
        prenom: prenom,
        email: email,
        type: type,
      };

      addUser.mutate(data);
    }
  };

  return (
    <main className={`${!showSidebar ? "main" : "main-full"} bg-slate-100`}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-bold text-3xl">Bibliothèque &gt; Utilisateurs</h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-4 bg-[#014455] text-white px-10 py-2 rounded-lg cursor-pointer"
        >
          <FaUserPlus size={22} />
          <span>Ajouter un utilisateur</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-5">
        <div className="px-3 py-2 bg-white shadow-md rounded-lg border-l-4 border-[#014455] space-y-2">
          <h3 className="text-slate-400 text-lg">Total utilisateurs</h3>
          <p className="text-3xl">{utilisateurs?.length}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-3 mt-6 overflow-x-auto">
        <div className="flex items-center justify-between gap-10">
          <div className="relative flex-1 border border-slate-300 py-2 rounded-lg px-2">
            <input
              type="search"
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="border-none outline-none w-full h-full"
            />
            <div
              // onClick={handleSeache}
              className="absolute right-1 top-1/2 -translate-y-1/2 grid place-items-center px-6 py-2 bg-[#235766] rounded-lg cursor-pointer"
            >
              <BsSearch size={18} className="text-white" />
            </div>
          </div>
          {/* <input
            type="search"
            placeholder="Rechercher un utilisateur..."
            className="flex-1 border border-slate-300 py-2 rounded-lg px-2"
          /> */}

          <div className="flex items-center gap-4">
            <p>Afficher :</p>
            <div className="bg-white p-1 flex items-center gap-4 rounded-lg">
              <p className="rounded-lg bg-[#235766] text-white py-1.5 px-4 cursor-pointer">
                Tout
              </p>
              <p>Etudiant</p>
              <p>Enseignant</p>
              <p>Personnel</p>
            </div>
          </div>
        </div>

        <table className="w-full min-w-[800px] mt-6">
          <thead>
            <tr className="text-gray-700 uppercase">
              <th className="text-start border-b border-slate-300">
                <div className="py-2 font-bold">Prénom et nom</div>
              </th>
              <th className="text-start border-b border-slate-300">
                <div className="py-2 font-bold">Email</div>
              </th>
              <th className="text-start border-b border-slate-300">
                <div className="py-2 font-bold">Type</div>
              </th>
              <th className="text-end border-b border-slate-300">
                <div className="py-2 font-bold">Actions</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs && utilisateurs?.length > 0 ? (
              utilisateurs.map((user) => (
                <tr key={user.id}>
                  <td className="border-b border-slate-300">
                    <div className="flex items-center gap-4 py-3 ">
                      <img
                        src={profile}
                        alt="profile"
                        className="w-12 h-12 rounded-full shadow-lg"
                      />
                      <div className="flex flex-col">
                        <h2 className="font-semibold text-lg">
                          {user.prenom} {user.nom}
                        </h2>
                        {/* <p className="text text-slate-500">Aurélien Géron</p> */}
                        {/* <p className="text text-slate-500">2025</p> */}
                      </div>
                    </div>
                  </td>
                  <td className="text-start border-b border-slate-300">
                    <div className="py-3 ">
                      <h2>{user.email}</h2>
                    </div>
                  </td>
                  <td className="text-left border-b border-slate-300">
                    <div className="py-3 ">
                      <p className="uppercase">{user.type}</p>
                    </div>
                  </td>
                  <td className="text-end border-b border-slate-300">
                    <div className="py-3 flex justify-end gap-4">
                      <FaUserEdit
                        size={22}
                        className="text-blue-400 cursor-pointer"
                      />
                      <MdDeleteForever
                        size={22}
                        className="text-red-400 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Aucun livre à afficher.</td>
              </tr>
            )}
          </tbody>
        </table>
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
                <h1 className="text-lg font-semibold">
                  AJOUT D'UN UTILISATEUR
                </h1>
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
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    placeholder="Nom"
                    className="p-2 rounded-lg border w-full border-gray-200"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="prenom" className="text-sm text-slate-500">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    placeholder="Ex: 124-DIT"
                    className="p-2 rounded-lg border border-gray-200 w-full"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="email" className="text-sm text-slate-500">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="email@dit.com"
                    className="p-2 rounded-lg border border-gray-200 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex-1">
                  <label htmlFor="type" className="text-sm text-slate-500">
                    Type
                  </label>

                  <select
                    id="utilisateur"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded-lg"
                  >
                    <option value="">Selectionner un utilisateur</option>
                    {types.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-sm px-8 py-2 text-sm font-semibold active:scale-95 cursor-pointer transition-colors bg-blue-950 text-white hover:bg-blue-800"
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

export default Utilisateurs;
