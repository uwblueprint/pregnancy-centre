import React, { FunctionComponent, useContext } from "react";

import { EditTestimonialsContext, MapQuoteEditState } from "../../pages/AdminEditTestimonialsPage";
import MapQuoteEditCard from "./MapQuoteEditCard";

const EditMapQuotesSection: FunctionComponent = () => {
    const { formState, setFormState } = useContext(EditTestimonialsContext);
    const { mapQuotes } = formState;

    const updateMapQuote = (newMapQuote: MapQuoteEditState) => {
        const newMapQuotes = mapQuotes.map((oldMapQuote) =>
            oldMapQuote.id === newMapQuote.id ? newMapQuote : oldMapQuote
        );
        const configMapQotes = newMapQuotes.map((mapQuote) => ({
            id: mapQuote.id,
            imagePath: mapQuote.imagePath,
            testimonial: mapQuote.testimonial
        }));
        setFormState({
            ...formState,
            mapQuotes: newMapQuotes,
            donorHomepageConfig: {
                ...formState.donorHomepageConfig,
                map: {
                    ...formState.donorHomepageConfig.map,
                    testimonials: configMapQotes
                }
            }
        });
    };

    const deleteMapQuote = (mapQuoteId: number) => {
        const newMapQuotes = mapQuotes.filter((mapQoute) => mapQoute.id !== mapQuoteId);
        setFormState({
            ...formState,
            mapQuotes: newMapQuotes
        });
    };

    const clearChangesOnMapQuote = (mapQuoteId: number) => {
        const oldMapQoute = formState.donorHomepageConfig.map.testimonials.find(
            (mapQoute) => mapQoute.id === mapQuoteId
        );
        if (oldMapQoute == null) {
            return;
        }
        const newMapQuotes = mapQuotes.map((mapQuote) => {
            if (mapQuote.id === mapQuoteId) {
                return {
                    error: "",
                    id: oldMapQoute.id,
                    imagePath: oldMapQoute.imagePath,
                    isEditing: false,
                    testimonial: oldMapQoute.testimonial
                };
            }
            return mapQuote;
        });
        setFormState({
            ...formState,
            mapQuotes: newMapQuotes
        });
    };

    return (
        <div className="edit-map-quotes-section">
            <h1>Map Quotes</h1>
            <div className="cards">
                {mapQuotes.map((mapQoute) => (
                    <MapQuoteEditCard
                        clearChanges={clearChangesOnMapQuote}
                        deleteMapQuote={deleteMapQuote}
                        key={mapQoute.id}
                        mapQuote={mapQoute}
                        updateMapQuote={updateMapQuote}
                    />
                ))}
            </div>
        </div>
    );
};

export default EditMapQuotesSection;
