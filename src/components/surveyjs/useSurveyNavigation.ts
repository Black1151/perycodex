import {useEffect, useState} from 'react';
import {SurveyModel} from 'survey-core';
import {PageModel} from 'survey-core/typings/packages/survey-core/src/page';

const useSurveyNavigation = (model: SurveyModel | null, dataset: any) => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isEditing, setIsEditing] = useState<boolean>(model?.mode === 'edit'); // Track the current mode
    const [pageListOptions, setPageListOptions] = useState<{ page: PageModel, title: string }[]>([]);

    useEffect(() => {
        // Initialize the current page when model is available
        if (model) {
            setCurrentPage(model.currentPageNo);
            setPageListOptions(getPageListOptions()); // Update the page list options initially
        }

        // Attach event listeners for page and value changes
        const onPageChangeHandler = () => {
            setCurrentPage(model?.currentPageNo || 0);
        };

        const onValueChangeHandler = () => {
            setPageListOptions(getPageListOptions()); // Update the page list when values change
        };

        model?.onCurrentPageChanged.add(onPageChangeHandler);
        model?.onValueChanged.add(onValueChangeHandler);

        // Cleanup event listeners when the component unmounts
        return () => {
            model?.onCurrentPageChanged.remove(onPageChangeHandler);
            model?.onValueChanged.remove(onValueChangeHandler); // Correct: remove instead of add here
        };
    }, [model]);

    const nextPage = () => {
        if (model && !model.isLastPage) {
            model.nextPage();
            setCurrentPage(model.currentPageNo);
        }
    };

    const prevPage = () => {
        if (model && !model.isFirstPage) {
            model.prevPage();
            setCurrentPage(model.currentPageNo);
        }
    };

    const jumpToPage = (page: PageModel) => {
        if (!model) return;

        const targetPageIndex = model.visiblePages.indexOf(page);
        const currentPageIndex = model.currentPageNo;

        // Check if the user is navigating backwards
        const isGoingBackwards = targetPageIndex < currentPageIndex;

        if (isGoingBackwards || model.currentPage.validate()) {
            // If going backwards or the current page is valid, allow navigation
            model.tryNavigateToPage(page);
        }
    };


    // Function to replace variables dynamically in strings
    const replaceVariables = (str: string, survey: SurveyModel) => {
        return str.replace(/\{([^}]+)\}/g, (match, variableName) => {
            // Retrieve the value of the variable from the survey model
            const value = survey.getVariable(variableName) || survey.data[variableName];

            // If the variable exists, replace it with its value; otherwise, return the original match
            return value !== undefined ? value : match;
        });
    };

    // Get the list of visible PageModel objects with dynamically replaced variables in titles
    // Returns an array of objects with each object containing the page, the new title, and the index
    const getPageListOptions = (): { page: PageModel, title: string, index: number }[] => {
        if (!model) return [];

        return model.visiblePages.map((page: PageModel, index: number) => {
            let title = page.title || `Page ${index + 1}`; // Default title if none exists
            if (title) {
                title = replaceVariables(title, model); // Replace variables in the title
            }
            return {page, title, index}; // Return an object with the page, title, and index
        });
    };


    const submitSurvey = () => {
        if (model && isEditing) {

            // Validate the entire survey before submitting
            if (!model.validate(true, true)) {
                model.focusOnFirstError;
                return 0;
            }

            if (!model.isCurrentPageHasErrors) {
                if (!model.completeLastPage()) {
                    model.focusOnFirstError;
                    return;
                }

                // Assuming the form is complete and valid
                model.clear(false, false);
                model.render();

                switchToDisplayMode();

            } else {
                // If there are errors, focus on the first page with an error
                model.focusOnFirstError;
            }
        }
    };

    // Toggle between edit and display modes
    const switchToEditMode = () => {
        if (model) {
            setIsEditing(true);
            model.mode = "edit";
        }
    };

    const switchToDisplayMode = () => {
        if (model) {
            setIsEditing(false);
            model.data = dataset
            model.mode = "display";
        }
    };

    return {
        currentPage,
        setCurrentPage,
        nextPage,
        prevPage,
        jumpToPage,
        submitSurvey,
        switchToEditMode,
        switchToDisplayMode,
        pageListOptions,
        isFirstPage: model?.isFirstPage || false,
        isLastPage: model?.isLastPage || false,
        isEditing,
    };
};

export default useSurveyNavigation;
