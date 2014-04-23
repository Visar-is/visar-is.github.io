"use strict";

// Import CSV / Excel
var PreviewCSV = function (element) {
    var csvPreviewTable,
        field,
        headerFields = [],
        
        defaultHeaderFields = [
            {key: 'fn', value: 'Full name'},
            {key: 'email', value: 'Email'},
            {key: 'phone', value: 'Phone'},
            {key: 'job_title', value: 'Job Title'},
            {key: 'organization', value: 'Organization'},
            {key: 'street_address', value: 'Street Address'},
            {key: 'additional_address', value: 'Additional Address'},
            {key: 'postal_code', value: 'Postal Code'},
            {key: 'city', value: 'City'},
            {key: 'region', value: 'Region'},
            {key: 'country', value: 'Country'},
            {key: 'private_notes', value: 'Notes'}
        ]
    ;

    this.defaultHeaderSelect = $('<select class="header-select"></select>');
    this.currentHeaderFields = this.defaultHeaderFields;
    this.input = $(element);
    this.previewIn = $('#' + this.input.attr('data-preview-in') || 'csv_preview' );
    this.columnListEl = this.input.closest('form').find('[name=csv_columns_list]');
    this.previewLimit = 5;

    this.init(element);
};

PreviewCSV.autoInit = function () {
    var picker = $('#file_csv'); 
    if(picker.length) {
        new PreviewCSV($('#file_csv'));
    }
};

$.extend(PreviewCSV.prototype, {
    defaultHeaderFields: [
        {key: 'fn', value: 'Full name'},
        {key: 'email', value: 'Email'},
        {key: 'phone', value: 'Phone'},
        {key: 'job_title', value: 'Job Title'},
        {key: 'organization', value: 'Organization'},
        {key: 'street_address', value: 'Street Address'},
        {key: 'additional_address', value: 'Additional Address'},
        {key: 'postal_code', value: 'Postal Code'},
        {key: 'city', value: 'City'},
        {key: 'region', value: 'Region'},
        {key: 'country', value: 'Country'},
        {key: 'private_notes', value: 'Notes'}
    ],

    init: function (element) {

        // Prepare header select
        var defaultHeaderFieldsNumbered = [],
            field,
            previewIn = this.previewIn,
            self = this;

        for (field in this.defaultHeaderFields) {
            this.defaultHeaderSelect.append($('<option />').val(this.defaultHeaderFields[field].key).text(this.defaultHeaderFields[field].value));
        }
        this.defaultHeaderSelect.append($('<option/>').val('skip').text('(Don\'t import this)'));

        this.input.change(function (event) {
            if (previewIn) {
                previewIn.html('');

                previewIn.append($('<p class="contacts-count"><span class="number"></span> <span class="words"></span></p>'));
                previewIn.append($('<p><strong>Please, check if the columns are correct.</strong> If not, pick the correct one for each line.</p>'));

                self.csvPreviewTable = $('<table class="csv-preview-table"></table>').appendTo(previewIn);

                self.csvPreviewTable.append($('<thead><tr><th class="first-line">First line<span class="help rock">(confirm the fields are correctly applied)</span></th><th colspan="5">Other lines</th></tr></thead>'));
                var updateColumnList = $.proxy(function () {
                    //console.log(currentHeaderFields);
                    var str = '';
                    for (field in self.currentHeaderFields) {
                        str += (str==''?'':',') + self.currentHeaderFields[field].key;
                    }
                    self.columnListEl.val(str);
                }, this);
                
                updateColumnList();

                self.input.parse({
                    config: {
                        header: false,
                        dynamicTyping: false,
                        preview: 0
                    },
                    complete: function (data) {
                        console.log('Completed CSV file parsing');
                        var rows = [];
                        var tbody = self.csvPreviewTable.append($('tbody'));
                        var counter = self.previewIn.find('.contacts-count');
                        var count = data.results.length;
                        counter
                            .find('.number')
                            .html(count)
                        ;
                        counter
                            .find('.words')
                            .html(' ' + (count != 1 ? 'items detected':'item detected') )
                        ;

                        for (var i=0;i<data.results.length && i<self.previewLimit;i++) {(function (row) {
                            for (var j=0; j<row.length; j++) {(function (column) {
                                
                                if (i === 0) {
                                    var rowEl = rows[j] = $('<tr></tr>').appendTo(tbody);
                                    var header = $('<th></th>');
                                    var columnSelect = self.defaultHeaderSelect.clone();
                                    header.append($('<span />').html(column == '' ? '<span class="empty">empty</span>':column));
                                    header.append(columnSelect);
                                    columnSelect.val(self.defaultHeaderFields[j].key);
                                    columnSelect.attr('data-index', j);
                                    columnSelect.change(function () {
                                        self.currentHeaderFields[columnSelect.attr('data-index')] = { key: columnSelect.val(), value: columnSelect.html() };
                                        updateColumnList();
                                    });
                                    
                                    rowEl.append(header);
                                } else {
                                    rows[j].append($('<td></td>').html(column == '' ? '<span class="empty">empty</span>':column));
                                }
                            }(row[j]));}
                        }(data.results[i]));}
                    }
                });
            }
        }); 
    }   
});

$(PreviewCSV.autoInit);
