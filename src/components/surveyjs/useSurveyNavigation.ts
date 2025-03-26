import { useEffect, useState } from "react";
import { SurveyModel } from "survey-core";
import { PageModel } from "survey-core/typings/packages/survey-core/src/page";

const useSurveyNavigation = (model: SurveyModel | null, dataset: any) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(model?.mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pageListOptions, setPageListOptions] = useState<
    { page: PageModel; title: string }[]
  >([]);

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

  // Function to find the first page with incomplete or invalid data
  const findFirstIncompletePage = (): PageModel | null => {
    if (!model) return null;

    for (const page of model.visiblePages) {
      // If the page is not valid or has errors, return it
      if (!page.validate(true)) {
        return page;
      }
    }

    // If all pages are valid, return null
    return null;
  };

  // Function to replace variables dynamically in strings
  const replaceVariables = (str: string, survey: SurveyModel) => {
    return str.replace(/\{([^}]+)\}/g, (match, variableName) => {
      // Retrieve the value of the variable from the survey model
      const value =
        survey.getVariable(variableName) || survey.data[variableName];

      // If the variable exists, replace it with its value; otherwise, return the original match
      return value !== undefined ? value : match;
    });
  };

  // Get the list of visible PageModel objects with dynamically replaced variables in titles
  // Returns an array of objects with each object containing the page, the new title, and the index
  const getPageListOptions = (): {
    page: PageModel;
    title: string;
    index: number;
  }[] => {
    if (!model) return [];

    return model.visiblePages.map((page: PageModel, index: number) => {
      let title = page.title || `Page ${index + 1}`; // Default title if none exists
      if (title) {
        title = replaceVariables(title, model); // Replace variables in the title
      }
      return { page, title, index }; // Return an object with the page, title, and index
    });
  };

  /*
  If a survey is saved - it means someone wants to continue editing the form
   */
  const saveSurvey = () => {
    if (model) {
      model.seduloState.isSave = true;

      setIsSubmitting(true);

      // Validate the entire survey before submitting
      if (!model.validate(true, true)) {
        model.focusOnFirstError;
        setIsSubmitting(false);
        return;
      }

      if (!model.isCurrentPageHasErrors) {
        if (!model.completeLastPage()) {
          model.focusOnFirstError;
          setIsSubmitting(false);
          return;
        }

        // Assuming the form is complete and valid
        model.clear(false, false);
        model.render();
      } else {
        // If there are errors, focus on the first page with an error
        model.focusOnFirstError;
      }

      setIsSubmitting(false);
    }
  };

  const submitSurvey = () => {
    if (model && isEditing) {
      setIsSubmitting(true);

      // Validate the entire survey before submitting
      if (!model.validate(true, true)) {
        model.focusOnFirstError;
        setIsSubmitting(false);
        return;
      }

      if (!model.isCurrentPageHasErrors) {
        if (!model.completeLastPage()) {
          model.focusOnFirstError;
          setIsSubmitting(false);
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

      setIsSubmitting(false);
    }
  };

  // Toggle between edit and display modes
  const switchToEditMode = () => {
    if (model) {
      setIsEditing(true);
      model.mode = "edit";

      // Find the first page with incomplete data and navigate to it
      const firstIncompletePage = findFirstIncompletePage();
      if (firstIncompletePage) {
        model.currentPage = firstIncompletePage; // Set the first incomplete page as the current page
        setCurrentPage(model.currentPageNo); // Update the state
      }
    }
  };

  const switchToDisplayMode = () => {
    if (model) {
      setIsEditing(false);
      model.mode = "display";
    }
  };

  const cancelSurvey = () => {
    if (model) {
      model.data = dataset;
      switchToDisplayMode();
    }
  };

  return {
    currentPage,
    setCurrentPage,
    nextPage,
    prevPage,
    jumpToPage,
    submitSurvey,
    saveSurvey,
    cancelSurvey,
    switchToEditMode,
    switchToDisplayMode,
    pageListOptions,
    isFirstPage: model?.isFirstPage || false,
    isLastPage: model?.isLastPage || false,
    isEditing,
    isSubmitting,
  };
};

export default useSurveyNavigation;
