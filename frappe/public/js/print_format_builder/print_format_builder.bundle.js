import PrintFormatBuilderComponent from "./PrintFormatBuilder.vue";
import { getStore } from "./store";

class PrintFormatBuilder {
	constructor({ wrapper, page, print_format }) {
		this.$wrapper = $(wrapper);
		this.page = page;
		this.print_format = print_format;

		this.page.clear_actions();
		this.page.clear_custom_actions();

		this.page.set_title(__("Editing {0}", [this.print_format]));
		this.page.set_primary_action(__("Save changes"), () => {
			this.$component.$store.save_changes();
		});
		this.page.set_secondary_action(__("Reset changes"), () => {
			this.$component.$store.reset_changes();
		});
		let $toggle_preview_btn = this.page.add_button(
			__("Toggle Preview"),
			() => this.$component.toggle_preview(),
			{ icon: "small-file" }
		);

		let $vm = new Vue({
			el: this.$wrapper.get(0),
			render: h =>
				h(PrintFormatBuilderComponent, {
					props: {
						print_format_name: print_format
					}
				})
		});
		this.$component = $vm.$children[0];
		let store = getStore(print_format);
		store.$watch("dirty", value => {
			if (value) {
				this.page.set_indicator("Not Saved", "orange");
				$toggle_preview_btn.hide();
			} else {
				this.page.clear_indicator();
				$toggle_preview_btn.show();
			}
		});
	}
}

frappe.provide("frappe.ui");
frappe.ui.PrintFormatBuilder = PrintFormatBuilder;
export default PrintFormatBuilder;
