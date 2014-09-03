/*
 * # MDMagick
 *
 * url: https://github.com/acumulus/MDMagick
 * author: http://fernandoguillen.info
 * demo page: http://fguillen.github.com/MDMagick/
 *
 * ## Version
 *
 * v0.0.3
 *
 * ## Documentation
 *
 * README: https://github.com/acumulus/MDMagick/blob/master/README.md
 */
var MDM_VERSION = "0.0.3";

function MDM(inputElement) {
    this.inputElement = inputElement;

    this.initialize = function () {
        this.controlsElement = MDM.Utils.appendControls(inputElement);
        this.previewElement = MDM.Utils.appendPreview(inputElement);

        this.activatePreview(this.inputElement, this.previewElement);
        this.activateControls(this.controlsElement);
        this.activateInput(this.inputElement, this.controlsElement, this.previewElement);

        this.updatePreview();
    };

    this.click_on_control = false;

    this.activateControls = function (controlsElement) {
        var _self = this;
        ["bold", "italic", "underline", "strikethru", "link", "image", "heading", "list", "numlist"].forEach(function (actionName) {
            if (typeof MDM.Actions[actionName] == 'function') {
                $(controlsElement).find(".mdm-" + actionName).click(function (event) {
                    _self.action(actionName, event);
                });
            }
        });
    };

    this.activatePreview = function (inputElement, previewElement) {
        $(inputElement).keyup($.proxy(this.updatePreview, this));
    };

    this.activateInput = function (inputElement, controlsElement, previewElement) {
        var _self = this;

        $(controlsElement).mousedown(function () {
            _self.click_on_control = true;
        });

        $(inputElement).focus(function () {
            _self.click_on_control = false;
            $(controlsElement).addClass("focus");
            $(previewElement).addClass("focus");
            $(controlsElement).removeClass("blur");
            $(previewElement).removeClass("blur");
        });

        $(inputElement).blur(function () {
            if (!_self.click_on_control) {
                $(controlsElement).removeClass("focus");
                $(previewElement).removeClass("focus");
                $(controlsElement).addClass("blur");
                $(previewElement).addClass("blur");
            }
        });
    };

    this.updatePreview = function () {
        var val = $(this.inputElement).val().replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var html = MDM.Actions['render'](val);
        $(this.previewElement).html(html);
    };

    this.action = function (actionName, event) {
        event.preventDefault();
        MDM.Actions[actionName](this.inputElement);
        this.updatePreview();
    };

    this.initialize();
}

/*
 * The logic for the markdown controls
 */
MDM.markdownActions = {
    renderShowdown: function(markup) {
        return new Attacklab.showdown.converter().makeHtml(markup);
    },

    renderMarked: function(inputElement) {
        return marked(markup);
    },

    render = renderMarked,

    bold: function(inputElement) {
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection("**" + selection.text + "**");
    },

    italic: function (inputElement) {
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection("_" + selection.text + "_");
    },

    link: function (inputElement) {
        var link = prompt("Link to URL", "http://");
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection("[" + selection.text + "](" + link + '"Title")');
    },

    image: function (inputElement) {
        var link = prompt("Link to image URL", "http://");
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection('![' + selection.text + '](' + link + ')');
    },

    heading: function (inputElement) {
        MDM.Utils.selectWholeLines(inputElement);
        var selection = $(inputElement).getSelection();
        var hash = (selection.text.charAt(0) == "#") ? "#" : "# ";
        $(inputElement).replaceSelection(hash + selection.text);
    },

    list: function (inputElement) {
        MDM.Utils.selectWholeLines(inputElement);
        var selection = $(inputElement).getSelection();
        var text = selection.text;
        var result = "";
        var lines = text.split("\n");

        for (var i = 0; i < lines.length; ++i) {
            var line = $.trim(lines[i]);

            if (line.length > 0) {
                result += "- " + line + "\n";
            }
        }

        $(inputElement).replaceSelection(result);
    },

    numlist: function (inputElement) {
        MDM.Utils.selectWholeLines(inputElement);
        var selection = $(inputElement).getSelection();
        var text = selection.text;
        var result = "";
        var lines = text.split("\n");

        for (var i = 0; i < lines.length; ++i) {
            var line = $.trim(lines[i]);

            if (line.length > 0) {
                result += "0. " + line + "\n";
            }
        }

        $(inputElement).replaceSelection(result);
    }
};

/*
 * The logic for the textile controls
 */
MDM.textileActions = {
    render: function(inputElement) {
        return textile(markup);
    },

    bold: function (inputElement) {
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection("*" + selection.text + "*");
    },

    italic: function (inputElement) {
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection("_" + selection.text + "_");
    },

    underline: function (inputElement) {
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection("+" + selection.text + "+");
    },

    strikethru: function (inputElement) {
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection("-" + selection.text + "-");
    },

    link: function (inputElement) {
        var link = prompt("Link to URL", "http://");
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection('"' + selection.text + ' (Title)":' + link);
    },

    image: function (inputElement) {
        var link = prompt("Link to image URL", "http://");
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection('!' + link + '(' + selection.text + ')!');
    },

    heading: function (inputElement) {
        MDM.Utils.selectWholeLines(inputElement);
        var selection = $(inputElement).getSelection();
        $(inputElement).replaceSelection('h2.' + selection.text);
    },

    list: function (inputElement) {
        MDM.Utils.selectWholeLines(inputElement);
        var selection = $(inputElement).getSelection();
        var text = selection.text;
        var result = "";
        var lines = text.split("\n");

        for (var i = 0; i < lines.length; ++i) {
            var line = $.trim(lines[i]);

            if (line.length > 0) {
                result += "- " + line + "\n";
            }
        }

        $(inputElement).replaceSelection(result);
    },

    numlist: function (inputElement) {
        MDM.Utils.selectWholeLines(inputElement);
        var selection = $(inputElement).getSelection();
        var text = selection.text;
        var result = "";
        var lines = text.split("\n");

        for (var i = 0; i < lines.length; ++i) {
            var line = $.trim(lines[i]);

            if (line.length > 0) {
                result += "0. " + line + "\n";
            }
        }

        $(inputElement).replaceSelection(result);
    }
};

/*
 * Assign the actions for the default markup format
 */
MDM.Actions = MDM.textileActions;

MDM.Utils = {
    appendControls: function (inputElement) {
        var element = $('<div />').addClass('mdm-buttons mdm-control');
        var list = $('<ul />');

        ['bold', 'italic', 'underline', 'strikethru', '|', 'link', 'image', '|', 'list', 'numlist', '|', 'heading'].forEach(function (actionName) {
            if (actionName == '|') {
                $('<li />').addClass('mdm-separator').append($('<span />').addClass('mdm-icon-separator')).appendTo(list);
            } else if (typeof MDM.Actions[actionName] == 'function') {
                $('<li />').addClass('mdm-button mdm-' + actionName).append($('<span />').addClass('mdm-icon-' + actionName)).appendTo(list);
            }
        });

        list.appendTo(element);
        $(inputElement).before(element);

        return element;
    },

    appendPreview: function (inputElement) {
        var element = $('<div />').addClass('mdm-preview mdm-control');
        element.css("width", $(inputElement).css("width"));
        // element.css("padding", $(inputElement).css("padding"));
        element.css("font-size", $(inputElement).css("font-size"));
        element.appendTo($(inputElement));

        return element;
    },

    selectWholeLines: function (inputElement) {
        var content = $(inputElement).val();
        var selection = $(inputElement).getSelection();
        var iniPosition = (selection.start > 0) ? (selection.start - 1) : 0;
        var endPosition = selection.end;

        // going back until a "\n"
        while (content[iniPosition] != "\n" && iniPosition >= 0) {
            --iniPosition;
        }

        while (content[endPosition] != "\n" && endPosition <= content.length) {
            ++endPosition;
        }

        $(inputElement).setSelection(iniPosition + 1, endPosition);
    }
};

$(function () {
    if (typeof window.MDM_SILENT == 'undefined' || window.MDM_SILENT == false) {
        console.debug("loading MDMagick v" + MDM_VERSION + "...");
    }

    jQuery.fn.mdmagick = function () {
        this.each(function (index, inputElement) {
            var mdm = new MDM(inputElement);
        });
    };

    $(".mdm-input").mdmagick();
});
