import { createContext, useContext, useEffect, useState } from 'react'

export const LANGS = ['en', 'fr']

const dict = {
  en: {
    works: 'Works', about: 'About', cart: 'Cart',
    sold: 'Sold', addToCart: 'Add to cart', inCart: 'In cart — view', unique: 'Original, one of a kind',
    medium: 'Medium', size: 'Size', year: 'Year', artist: 'Artist',
    certificate: 'Signed by the artist. Delivered with a certificate of authenticity. Insured worldwide shipping.',
    prev: 'Previous', next: 'Next', allWorks: 'All works', zoom: 'View larger', close: 'Close',
    added: 'added to cart', view: 'View',
    cartEmpty: 'Your cart is empty', browse: 'Browse works', total: 'Total', remove: 'Remove',
    checkout: 'Checkout', continue: 'Continue browsing', soldRemoved: 'This work has just been sold',
    contact: 'Contact', name: 'Full name', email: 'Email', phone: 'Phone',
    delivery: 'Delivery', country: 'Country', city: 'City', zip: 'Postal code', street: 'Street address',
    payment: 'Payment', comment: 'Message (optional)', shipping: 'Shipping',
    shipCourier: 'Insured art courier', shipCourierNote: 'Worldwide. Cost quoted after confirmation',
    shipPickup: 'Collect from the gallery', shipPickupNote: 'Paris, by appointment',
    payTransfer: 'Bank transfer', payTransferNote: 'Invoice sent after confirmation',
    payCard: 'Card', payCardNote: 'Secure payment link sent after confirmation',
    quoted: 'Quoted', free: 'Free',
    consent: 'I agree to the processing of my personal data in accordance with the',
    privacy: 'privacy policy', placeOrder: 'Place order', sending: 'Sending…',
    orderError: 'The order could not be sent. Please try again or write to us at',
    thanks: 'Thank you', orderReceived: 'Order {n} received',
    orderText: 'We will contact you within one business day to confirm availability, shipping and payment.',
    questions: 'Questions about your order', back: 'Back to works', notFound: 'Page not found',
    yourOrder: 'Your order', subtotal: 'Subtotal',
    aboutTitle: 'About',
    aboutText: [
      'We show and sell original paintings by contemporary artists — abstraction, colour and quiet forms.',
      'Every work is unique, signed by the artist and delivered with a certificate of authenticity.',
    ],
    shippingTitle: 'Shipping & returns',
    shippingText: [
      'Works are professionally packed and shipped worldwide by insured art couriers. Shipping cost is quoted individually after your order.',
      'You can return a work within 14 days of delivery in its original condition.',
    ],
    privacyTitle: 'Privacy policy',
    privacyText: [
      'We only collect the data needed to fulfil your order: name, contact details and delivery address.',
      'Your data is used solely to process and deliver your order and is shared only with the shipping carrier.',
      'You can request deletion of your data at any time by email.',
    ],
    rights: 'All rights reserved',
  },
  fr: {
    works: 'Œuvres', about: 'À propos', cart: 'Panier',
    sold: 'Vendu', addToCart: 'Ajouter au panier', inCart: 'Dans le panier — voir', unique: 'Original, pièce unique',
    medium: 'Technique', size: 'Dimensions', year: 'Année', artist: 'Artiste',
    certificate: 'Signée par l’artiste. Livrée avec un certificat d’authenticité. Expédition assurée dans le monde entier.',
    prev: 'Précédente', next: 'Suivante', allWorks: 'Toutes les œuvres', zoom: 'Agrandir', close: 'Fermer',
    added: 'ajoutée au panier', view: 'Voir',
    cartEmpty: 'Votre panier est vide', browse: 'Voir les œuvres', total: 'Total', remove: 'Retirer',
    checkout: 'Commander', continue: 'Continuer', soldRemoved: 'Cette œuvre vient d’être vendue',
    contact: 'Coordonnées', name: 'Nom complet', email: 'E-mail', phone: 'Téléphone',
    delivery: 'Livraison', country: 'Pays', city: 'Ville', zip: 'Code postal', street: 'Adresse',
    payment: 'Paiement', comment: 'Message (facultatif)', shipping: 'Livraison',
    shipCourier: 'Transporteur d’art assuré', shipCourierNote: 'Monde entier. Devis après confirmation',
    shipPickup: 'Retrait à la galerie', shipPickupNote: 'Paris, sur rendez-vous',
    payTransfer: 'Virement bancaire', payTransferNote: 'Facture envoyée après confirmation',
    payCard: 'Carte bancaire', payCardNote: 'Lien de paiement sécurisé envoyé après confirmation',
    quoted: 'Sur devis', free: 'Gratuit',
    consent: 'J’accepte le traitement de mes données personnelles conformément à la',
    privacy: 'politique de confidentialité', placeOrder: 'Passer la commande', sending: 'Envoi…',
    orderError: 'La commande n’a pas pu être envoyée. Réessayez ou écrivez-nous à',
    thanks: 'Merci', orderReceived: 'Commande {n} reçue',
    orderText: 'Nous vous contacterons sous un jour ouvré pour confirmer la disponibilité, la livraison et le paiement.',
    questions: 'Une question sur votre commande', back: 'Retour aux œuvres', notFound: 'Page introuvable',
    yourOrder: 'Votre commande', subtotal: 'Sous-total',
    aboutTitle: 'À propos',
    aboutText: [
      'Nous exposons et vendons des peintures originales d’artistes contemporains — abstraction, couleur et formes silencieuses.',
      'Chaque œuvre est unique, signée par l’artiste et livrée avec un certificat d’authenticité.',
    ],
    shippingTitle: 'Livraison et retours',
    shippingText: [
      'Les œuvres sont emballées par des professionnels et expédiées dans le monde entier par des transporteurs d’art assurés. Les frais de livraison font l’objet d’un devis après la commande.',
      'Vous pouvez retourner une œuvre dans les 14 jours suivant la livraison, dans son état d’origine.',
    ],
    privacyTitle: 'Politique de confidentialité',
    privacyText: [
      'Nous ne collectons que les données nécessaires à votre commande : nom, coordonnées et adresse de livraison.',
      'Vos données servent uniquement au traitement et à la livraison de la commande et ne sont transmises qu’au transporteur.',
      'Vous pouvez demander la suppression de vos données à tout moment par e-mail.',
    ],
    rights: 'Tous droits réservés',
  },
}

const LangContext = createContext(null)
const KEY = 'gallery-lang'

function initial() {
  try {
    const saved = localStorage.getItem(KEY)
    if (LANGS.includes(saved)) return saved
  } catch {}
  return (navigator.language || '').toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initial)
  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem(KEY, lang) } catch {}
  }, [lang])
  const t = (k, vars) => {
    let s = dict[lang][k] ?? dict.en[k] ?? k
    if (vars && typeof s === 'string') for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b)
    return s
  }
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
