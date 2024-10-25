import DraggableGridsComponent from "@/components/agGrids/DraggableGridsComponent";
import {ColDef} from "ag-grid-community";

export default function MyCustomerPage() {
    // Example datasets
    const populationData = [
        {id: 1, name: 'John Doe', age: 28, job: 'Engineer'},
        {id: 9, name: 'John Doe', age: 28, job: 'Engineer'},
        {id: 2, name: 'Jane Smith', age: 34, job: 'Doctor'},
        {id: 3, name: 'Alice Johnson', age: 22, job: 'Designer'},
        {id: 4, name: 'Bob Brown', age: 45, job: 'Manager'},
        {id: 5, name: 'Charlie White', age: 30, job: 'Developer'},
        {id: 6, name: 'Dana Black', age: 27, job: 'Writer'},
        {id: 7, name: 'Eve Green', age: 50, job: 'Teacher'},
        {id: 8, name: 'Frank Yellow', age: 38, job: 'Scientist'}
    ];

    const sampleData = [
        {id: 5, name: 'Charlie White', age: 30, job: 'Developer'},
        {id: 6, name: 'Dana Black', age: 27, job: 'Writer'}
    ];

    const fieldDefs: ColDef[] = [
        {headerName: 'ID', field: 'id', rowDrag: true},
        {headerName: 'Name', field: 'name'},
        {headerName: 'Age', field: 'age'},
        {headerName: 'Job', field: 'job'},
    ]

    return (
        <>
            <DraggableGridsComponent
                populationData={populationData}
                populationTitle={'ALL USERS'}
                sampleData={sampleData}
                sampleTitle={'USER GROUP MEMBERS'}
                fieldDefs={fieldDefs}
                dynamicIdField={'id'}
            />
        </>
    );
}
