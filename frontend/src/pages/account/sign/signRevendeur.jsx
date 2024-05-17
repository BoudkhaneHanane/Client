import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import zxcvbn from "zxcvbn";
import "./signin.css";

const SignRevendeur = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    numero_telephone: "",
    email: "",
    Date_anniversaire: "",
    password: "",
    confirmPassword: "",
    devenirRevendeur: false,
    companyName: "",
    businessRegistration: "",
    taxIdentificationNumber: "",
    taxArticle: "",
    registrationNumber: "",
    type: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
  }); // Force et message du mot de passe
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "password") {
      const result = zxcvbn(value); // Évaluer la force du mot de passe
      setPasswordStrength({
        score: result.score,
        message: result.feedback.suggestions[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    const requiredFields = [
      "nom",
      "prenom",
      "adresse",
      "numero_telephone",
      "email",
      "Date_anniversaire",
      "password",
      "confirmPassword",
    ];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Ce champ est requis";
        // Ajouter la classe 'errors' aux champs avec des erreurs
        errors[field] = "errors";
      } else {
        // Supprimer la classe 'errors' des champs sans erreurs
        errors[field] = "";
      }
    });
    // Vérification du numéro de téléphone
    if (
      formData.numero_telephone &&
      (isNaN(formData.numero_telephone) ||
        formData.numero_telephone.length !== 10)
    ) {
      newErrors.numero_telephone =
        "Le numéro de téléphone doit être un nombre de 10 chiffres";
    }

    // Vérification de l'email
    const emailPattern = /\S+@\S+\.\S+/;
    if (formData.email && !emailPattern.test(formData.email)) {
      newErrors.email = "Veuillez saisir une adresse email valide";
    }

    // Vérification de la date de naissance
    const birthDate = new Date(formData.Date_anniversaire);
    const currentDate = new Date();
    if (birthDate >= currentDate) {
      newErrors.Date_anniversaire =
        "La date de naissance doit être antérieure à la date actuelle";
    }

    // Vérification de la correspondance des mots de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Si des erreurs sont trouvées, les définir et arrêter la soumission du formulaire
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si aucune erreur n'est trouvée, continuer avec la soumission du formulaire

    // Définir le type en fonction de l'option "Devenir Revendeur"
    const userType = formData.devenirRevendeur ? "Revendeur" : "Client";

    // Créer un nouvel objet FormData avec le type défini
    const formDataWithUserType = { ...formData, type: userType };

    // Envoyer la demande d'inscription au serveur
    try {
      const response = await fetch("http://localhost:3002/utilisateur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithUserType),
      });

      if (response.ok) {
        // Réinitialiser le formulaire après une inscription réussie
        setFormData({
          nom: "",
          prenom: "",
          adresse: "",
          numero_telephone: "",
          email: "",
          Date_anniversaire: "",
          password: "",
          confirmPassword: "",
          devenirRevendeur: false,
          companyName: "",
          businessRegistration: "",
          taxIdentificationNumber: "",
          taxArticle: "",
          registrationNumber: "",
          type: "",
        });
        setErrors({});
        setMessage("Inscription réussie!");

        // Si l'utilisateur est un revendeur, afficher une alerte après 2 minutes
        if (formData.devenirRevendeur) {
          alert(
            "Your request has been recorded. Please wait for an email confirmation from the administrator within 48 hours."
          );
          // Rediriger l'utilisateur vers la page d'accueil après l'alerte
          window.location.href = "/";
        } else {
          // Rediriger les clients vers la page d'accueil
          window.location.href = "/";
        }
      } else {
        setErrors(response.data.errors);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Une erreur s'est produite lors de l'inscription.");
    }
  };
  return (
    <div className="sign">
      <div className="signup-page">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="signupformu">Sign Up Client</h2>
          <hr />
          <div className={`form-group ${errors.nom ? "errors" : ""}`}>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className={errors.nom ? "errors" : ""}
            />
            {errors.nom && <p className="errors">{errors.nom}</p>}
          </div>
          <div className={`form-group ${errors.prenom ? "errors" : ""}`}>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className={errors.prenom ? "errors" : ""}
            />
            {errors.prenom && <p>{errors.prenom}</p>}
          </div>
          <div className={`form-group ${errors.adresse ? "errors" : ""}`}>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className={errors.adresse ? "errors" : ""}
            />
            {errors.adresse && <p>{errors.adresse}</p>}
          </div>
          <div
            className={`form-group ${errors.numero_telephone ? "errors" : ""}`}
          >
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              name="numero_telephone"
              value={formData.numero_telephone}
              onChange={handleChange}
              className={errors.numero_telephone ? "errors" : ""}
            />
            {errors.numero_telephone && <p>{errors.numero_telephone}</p>}
          </div>
          <div className={`form-group ${errors.email ? "errors" : ""}`}>
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
              className={errors.email ? "errors" : ""}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div
            className={`form-group ${errors.Date_anniversaire ? "errors" : ""}`}
          >
            <label htmlFor="birthDate">Date of Birth:</label>
            <input
              type="date"
              id="birthDate"
              name="Date_anniversaire"
              value={formData.Date_anniversaire}
              onChange={handleChange}
              className={errors.Date_anniversaire ? "errors" : ""}
            />
            {errors.Date_anniversaire && <p>{errors.Date_anniversaire}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={errors.password ? "errors" : ""}
            />
            {formData.password && (
              <div
                className={`password-strength strength-${passwordStrength.score}`}
              >
                <p>{passwordStrength.message}</p>
              </div>
            )}
            {errors.password && <p className="errors">{errors.password}</p>}
          </div>

          <div
            className={`form-group ${errors.confirmPassword ? "errors" : ""}`}
          >
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className={errors.confirmPassword ? "errors" : ""}
            />
            {errors.confirmPassword && (
              <p className="errors">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="devenirRevendeur"
                checked={formData.devenirRevendeur}
                onChange={handleChange}
              />
              Become a reseller
            </label>
          </div>
          {/* Champs supplémentaires pour les revendeurs */}
          {formData.devenirRevendeur && (
            <>
              <div
                className={`form-group ${errors.companyName ? "errors" : ""}`}
              >
                <label htmlFor="companyName">Company Name:</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={errors.companyName ? "errors" : ""}
                />
                {errors.companyName && <p>{errors.companyName}</p>}
              </div>
              <div
                className={`form-group ${
                  errors.businessRegistration ? "errors" : ""
                }`}
              >
                <label htmlFor="businessRegistration">
                  Business Registration:
                </label>
                <input
                  type="text"
                  id="businessRegistration"
                  name="businessRegistration"
                  value={formData.businessRegistration}
                  onChange={handleChange}
                  className={errors.businessRegistration ? "errors" : ""}
                />
                {errors.businessRegistration && (
                  <p>{errors.businessRegistration}</p>
                )}
              </div>
              <div
                className={`form-group ${
                  errors.taxIdentificationNumber ? "errors" : ""
                }`}
              >
                <label htmlFor="taxIdentificationNumber">
                  Tax Identification Number:
                </label>
                <input
                  type="text"
                  id="taxIdentificationNumber"
                  name="taxIdentificationNumber"
                  value={formData.taxIdentificationNumber}
                  onChange={handleChange}
                  className={errors.taxIdentificationNumber ? "errors" : ""}
                />
                {errors.taxIdentificationNumber && (
                  <p>{errors.taxIdentificationNumber}</p>
                )}
              </div>
              <div
                className={`form-group ${errors.taxArticle ? "errors" : ""}`}
              >
                <label htmlFor="taxArticle">Tax Article:</label>
                <input
                  type="text"
                  id="taxArticle"
                  name="taxArticle"
                  value={formData.taxArticle}
                  onChange={handleChange}
                  className={errors.taxArticle ? "errors" : ""}
                />
                {errors.taxArticle && <p>{errors.taxArticle}</p>}
              </div>
              <div
                className={`form-group ${
                  errors.registrationNumber ? "errors" : ""
                }`}
              >
                <label htmlFor="registrationNumber">Registration Number:</label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className={errors.registrationNumber ? "errors" : ""}
                />
                {errors.registrationNumber && (
                  <p>{errors.registrationNumber}</p>
                )}
              </div>
            </>
          )}

          <button className="signupbotton" type="submit">
            Sign Up
          </button>
        </form>
        <p className="ppp">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignRevendeur;
